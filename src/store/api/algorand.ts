const algosdk = require('algosdk');
const apiKey = require('../../config.json').apiConfig.apiKey;
const baseUrl = require('../../config.json').apiConfig.baseUrl;

interface AlgorandAccount {
    addr: string;
    sk: string | null;
    error: string;
}

export function generatePair(mnemonics: string): AlgorandAccount {
    try {
        let tmp_acc = algosdk.mnemonicToSecretKey(mnemonics);
        const account = { ...tmp_acc, sk: tmp_acc.sk.toString() }
        return { ...account, error: '' };
    }
    catch (e) {
        console.log('error generatePair', e.message);
        return {
            addr: "",
            sk: null,
            error: e.message
        }
    }
}
export function createMultiSigAddress(payload: {
    owner1: string;
    owner2: string;
    owner3: string;
}): string {
    const mparams = {
        version: 1,
        threshold: 2,
        addrs: [
            payload.owner1,
            payload.owner2,
            payload.owner3
        ].sort(),
    };
    try {
        return algosdk.multisigAddress(mparams);;
    }
    catch (e) {
        console.log(e);
        return "error";
    }
}

export async function send(params: {
    sk: string,
    to: string,
    amount: number
}) {
    try {
        let algodclient = new algosdk.Algodv2(
            {
                "X-API-Key": apiKey
            },
            baseUrl,
            '');
        let txParams = await algodclient.getTransactionParams().do();
        let txn = {
            "to": params.to,
            "fee": txParams.fee,
            "amount": params.amount,
            "firstRound": txParams.firstRound,
            "lastRound": txParams.lastRound,
            "genesisID": txParams.genesisID,
            "genesisHash": txParams.genesisHash,
            "note": new Uint8Array(0)
        };
        var signedTxn = algosdk.signTransaction(txn, Buffer.from(params.sk.split(',')));

        let tx = await algodclient.sendRawTransaction(signedTxn.blob);
        console.log(signedTxn, tx)

        return signedTxn.txID;
    } catch (e) {
        console.log(e);
        return "error";
    }

}
export async function initiateNewMsigTransaction(
    msigParams: {
        owner1: string,
        owner2: string,
        owner3: string,
        addr: string
    },
    beneficiary: string,
    sk: string,
    amount: number
): Promise<any> {

    let algodclient = new algosdk.Algodv2(
        {
            "X-API-Key": apiKey
        },
        baseUrl,
        '');
    let params = await algodclient.getTransactionParams().do();
    let msigparams = {
        version: 1,
        threshold: 2,
        addrs: [
            msigParams.owner1,
            msigParams.owner2,
            msigParams.owner3,
        ].sort(),
    };
    let txn = {
        "from": algosdk.multisigAddress(msigparams),
        "to": beneficiary,
        "fee": params.fee,
        "amount": amount,
        "firstRound": params.firstRound,
        "lastRound": params.lastRound,
        "genesisID": params.genesisID,
        "genesisHash": params.genesisHash,
        "note": new Uint8Array(0)
    };
    let ss = sk.split(',');
    try {
        let rawSignedTxn = algosdk.signMultisigTransaction(txn, msigparams, Uint8Array.from(ss as any)).blob;
        const tx = algosdk.decodeObj(rawSignedTxn).txn;
        const decoded = algosdk.decodeObj(rawSignedTxn);
        console.log('tx', tx, decoded);
        return rawSignedTxn;
    } catch (e) {
        console.log(e);
        return "error";
    }

}

export async function confirmAndSendTransaction(
    msigParams: {
        owner1: string,
        owner2: string,
        owner3: string,
        addr: string
    },
    sk: string,
    blob: string) {
    let algodclient = new algosdk.Algodv2(
        {
            "X-API-Key": apiKey
        },
        baseUrl,
        '');
    let msigparams = {
        version: 1,
        threshold: 2,
        addrs: [
            msigParams.owner1,
            msigParams.owner2,
            msigParams.owner3,
        ],
    };

    let ss = sk.split(',');
    let bb = blob.split(',');
    let buffer = Uint8Array.from(bb as any);
    console.log('Secret', ss);
    try {
        let directsig = algosdk.appendSignMultisigTransaction(buffer,
            msigparams,
            Uint8Array.from(ss as any)).blob;
        let txId = await algodclient.sendRawTransaction(directsig,
            (res: any) => console.log('sendRawTransaction result: ', JSON.stringify(res))).do();
        return txId;
    } catch (e) {
        console.log(e);
        return "error";
    }

}
export function getMsigTXparams(blob: string) {
    let tmp = blob.split(',');
    try {
        let decodedTx = algosdk.decodeObj(Uint8Array.from(tmp as any));
        return {
            owner1: algosdk.encodeAddress(decodedTx.msig.subsig[0].pk),
            owner2: algosdk.encodeAddress(decodedTx.msig.subsig[1].pk),
            owner3: algosdk.encodeAddress(decodedTx.msig.subsig[2].pk),
            from: algosdk.encodeAddress(decodedTx.txn.snd),
            to: algosdk.encodeAddress(decodedTx.txn.rcv),
            fee: decodedTx.txn.fee,
            amount: decodedTx.txn.amt,
            version: decodedTx.msig.v,
            threshold: decodedTx.msig.thr
        }
    }
    catch (e) {
        console.log('getMsigTXparams error', e);
        return null;
    }
}