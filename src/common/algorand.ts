declare var AlgoSigner: any;


export function algoSignerCheck(): boolean {
    if (typeof AlgoSigner !== 'undefined') {
        return true;
    } else {
        return false;
    }
}

export function getAlgoSigner(): any {
    if (algoSignerCheck()) {
        return AlgoSigner;
    } else {
        return null;
    }
}