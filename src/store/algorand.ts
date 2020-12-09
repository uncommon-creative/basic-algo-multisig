import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppReduxStateInterface } from './index';
import update from 'immutability-helper';

export interface AlgorandInterface {
    connected: boolean,
    currentAddress: string,
    account: {
        mnemonics: string;
        addr: string;
        sk: string | null;
        error: string;
    },
    lastTxSent: {
        txID: string
    },
    escrow: {
        multisigParams: {
            owner1: string,
            owner2: string,
            owner3: string,
            addr: string,
            fstSignBlob: string,
            sentTxId: any
        }
        newEscrow?: any

    }
}
export const algorandSlice = createSlice({
    name: 'algorand',
    initialState: {
        connected: false,
        currentAddress: "unknown address",
        account: {
            mnemonics: "",
            addr: "",
            sk: null,
            error: "",
        },
        lastTxSent: {
            txID: ""
        },
        escrow: {
            multisigParams: {
                owner1: "",
                owner2: "",
                owner3: "",
                addr: "",
                fstSignBlob: "",
                sentTxId: null
            },
            newEscrow: null
        }
    },
    reducers: {
        setConnected(state, action: PayloadAction<boolean>) { state.connected = action.payload },
        setCurrentAddress(state, action: PayloadAction<string>) { state.currentAddress = action.payload },
        setMultiSigAddress(state, action: PayloadAction<any>) {
            console.log('setMultiSigAddress reducer', action.payload)
            state.escrow.multisigParams.owner1 = action.payload.owner1;
            state.escrow.multisigParams.owner2 = action.payload.owner2;
            state.escrow.multisigParams.owner3 = action.payload.owner3;
            state.escrow.multisigParams.addr = action.payload.addr;
        },
        setNewEscrow(state, action: PayloadAction<any>) {
            state = update(state, {
                escrow: {
                    newEscrow: { $set: action.payload }
                }
            })
        },
        setAccount(state, action: PayloadAction<any>) {
            state.account = {
                mnemonics: action.payload.mnemonics,
                addr: action.payload.addr,
                sk: action.payload.sk,
                error: action.payload.error,
            }

        },
        setFirstBlob(state, action: PayloadAction<string>) {
            state.escrow.multisigParams.fstSignBlob = action.payload
        },
        setSentTx(state, action: PayloadAction<any>) {
            state.escrow.multisigParams.sentTxId = action.payload
        },
        setLastTx(state, action: PayloadAction<string>) {
            state.lastTxSent.txID = action.payload
        },
        willConnectToAlgoSigner(_state) { },
        willMultiSignTransaction(_state, _action: PayloadAction<any>) { },
        willGenerateAccountPair(_state, _action: PayloadAction<any>) { },
        willFirstSignTransaction(_state, _action: PayloadAction<any>) { },
        willconfirmAndSignTX(_state, _action: PayloadAction<any>) { },
        willFundMultisigAddress(_state, _action: PayloadAction<{
            sk: string,
            to: string,
            amount: number
        }>) { }
    }
})

export const { actions, reducer } = algorandSlice;
export const { setConnected, setFirstBlob, setCurrentAddress, willFundMultisigAddress, willConnectToAlgoSigner, willconfirmAndSignTX } = actions;
export const selectors = {
    isConnected: (state: AppReduxStateInterface) => state.algorand.connected,
    currentAddress: (state: AppReduxStateInterface) => state.algorand.account.addr,
    multisigParams: (state: AppReduxStateInterface) => state.algorand.escrow.multisigParams,
    generatedKeyError: (state: AppReduxStateInterface) => state.algorand.account.error,
    sk: (state: AppReduxStateInterface) => state.algorand.account.sk,
    fstBlob: (state: AppReduxStateInterface) => state.algorand.escrow.multisigParams.fstSignBlob,
    sentTxId: (state: AppReduxStateInterface) => state.algorand.escrow.multisigParams.sentTxId,
    lastTxID: (state: AppReduxStateInterface) => state.algorand.lastTxSent.txID,
};