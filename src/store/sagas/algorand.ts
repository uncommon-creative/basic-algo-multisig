import { takeLatest } from 'redux-saga/effects';
import { put, call, } from 'redux-saga/effects';
import * as AlgorandStore from '../algorand';
import * as UIStore from '../ui';
import { PayloadAction } from '@reduxjs/toolkit';
import { createMultiSigAddress, generatePair, send as sendAmount, initiateNewMsigTransaction, confirmAndSendTransaction } from '../api/algorand';
import { push } from 'connected-react-router';
export function* willLoadSaga() {
    yield takeLatest(AlgorandStore.actions.willMultiSignTransaction.type, willMultiSignTransaction);
    yield takeLatest(AlgorandStore.actions.willGenerateAccountPair.type, willGenerateAccountPair);
    yield takeLatest(AlgorandStore.actions.willFirstSignTransaction.type, willFirstSignTransaction);
    yield takeLatest(AlgorandStore.actions.willconfirmAndSignTX.type, willconfirmAndSignTX);
    yield takeLatest(AlgorandStore.actions.willFundMultisigAddress.type, willFundMultisigAddress);
}
function* willMultiSignTransaction(action: PayloadAction<any>) {
    console.log('in willMultiSignTransaction saga with action :', action.payload);
    try {
        let multi = yield call(createMultiSigAddress, action.payload);
        yield put(AlgorandStore.actions.setMultiSigAddress({ ...action.payload, addr: multi }));
    }
    catch (e) {
        console.log('multiSign error', e);
    }
}

function* willGenerateAccountPair(action: PayloadAction<any>) {
    let account = generatePair(action.payload);
    yield put(AlgorandStore.actions.setAccount({ ...account, mnemonics: action.payload }));
    yield put(push('/index'));
    if (account.error) {
        yield put(UIStore.actions.error(true));
    }
}

function* willFirstSignTransaction(action: PayloadAction<any>) {
    yield put(UIStore.actions.loading(true));
    let blob = yield call(initiateNewMsigTransaction,
        action.payload.msigParams,
        action.payload.beneficiary,
        action.payload.sk,
        action.payload.amount
    );

    yield put(UIStore.actions.loading(false));
    if (blob === "error") {
        yield put(UIStore.actions.error(true));
    } else {
        yield put(AlgorandStore.actions.setFirstBlob(blob.toString()));
    }
}
function* willconfirmAndSignTX(action: PayloadAction<any>) {
    yield put(UIStore.actions.loading(true));
    let txId = yield call(confirmAndSendTransaction,
        action.payload.msigParams,
        action.payload.sk,
        action.payload.blob
    );
    yield put(AlgorandStore.actions.setSentTx(txId));
    yield put(UIStore.actions.loading(false));
    if (txId === "error") {
        yield put(UIStore.actions.error(true));
    }
}

function* willFundMultisigAddress(action: PayloadAction<any>) {
    yield put(UIStore.actions.loading(true));
    let result = yield call(sendAmount, {
        sk: action.payload.sk,
        to: action.payload.to,
        amount: action.payload.amount
    });
    yield put(UIStore.actions.loading(false));
    if (result === "error") {
        yield put(UIStore.actions.error(true));
    } else {
        yield put(AlgorandStore.actions.setLastTx(result));

    }
}
