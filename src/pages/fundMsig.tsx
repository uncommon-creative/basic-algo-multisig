
import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';
import * as UIStore from '../store/ui';
import { createMultiSigAddress } from '../store/api/algorand';
const algosdk = require('algosdk');

export function FundMsig() {
    let [owner1, setowner1] = useState("");
    let [owner2, setowner2] = useState("");
    let [owner3, setowner3] = useState("");
    let [msig, setMsig] = useState("");
    let [amount, setAmount] = useState(0);

    const dispatch = useDispatch();
    const sk = useSelector(AlgorandStore.selectors.sk);
    const isLoading = useSelector(UIStore.selectors.isLoading);
    const isError = useSelector(UIStore.selectors.isError);
    const lastTx = useSelector(AlgorandStore.selectors.lastTxID);

    useEffect(() => {
        dispatch(UIStore.actions.error(false));
        if (algosdk.isValidAddress(owner2) && algosdk.isValidAddress(owner3) && algosdk.isValidAddress(owner3)) {
            setMsig(createMultiSigAddress({
                owner1, owner2, owner3
            }));
        }
    }, [dispatch, owner1, owner2, owner3])

    return (
        <div style={{ textAlign: "center" }}>
            <h1>
                Fund a Multisig Address (order matters)
            </h1>
            <div style={{
                width: 800,
                marginRight: "auto",
                marginLeft: "auto",
                border: "1px solid #000"
            }}>
                <p>
                    <b>
                        <label htmlFor="owner1">Owner 1</label>
                    </b>
                    <input onChange={(e) => setowner1(e.target.value)} value={owner1} className="inputblock" id="owner1" type="text" />
                </p>
                <p>
                    <b>
                        <label htmlFor="owner2">Owner 2</label>
                    </b>
                    <input onChange={(e) => setowner2(e.target.value)} value={owner2} className="inputblock" id="owner2" type="text" />
                </p>
                <p>
                    <b>
                        <label htmlFor="owner3 ">Owner 3</label>
                    </b>
                    <input onChange={(e) => setowner3(e.target.value)} value={owner3} className="inputblock" id="owner3" type="text" />
                </p>
                <p>
                    Or...
            </p>
                <p>
                    <b>
                        <label htmlFor="msig ">Multisig Address</label>
                    </b>
                </p>
                <p>
                    <input onChange={(e) => {
                        setMsig(e.target.value)
                    }} value={msig} className="inputblock" id="owner3" type="text" />
                </p>
                <p>
                    <b>
                        <label htmlFor="owner3 ">Set amount in micro Algos (1 mAlgo = 10^-6 Algos) </label>
                    </b>
                    <input onChange={(e) => setAmount(Number(e.target.value))} value={amount} className="inputblock" id="owner3" type="text" />
                </p>
                <p>
                    {((algosdk.isValidAddress(owner1) && algosdk.isValidAddress(owner2) && algosdk.isValidAddress(owner3)) || algosdk.isValidAddress(msig)) &&
                        <button disabled={isLoading} onClick={async () => {
                            dispatch(AlgorandStore.actions.willFundMultisigAddress({
                                amount: amount,
                                sk: sk as any,
                                to: msig || createMultiSigAddress({
                                    owner1, owner2, owner3
                                })
                            }));
                        }} className="smallblock">Send</button>}

                </p>
                {isError && <div> <h2><p><b> <span className="label danger">An error has occurred</span></b></p> </h2></div>}

                {isLoading && <p style={{ display: "inline-block" }} className="loader"></p>}
                {(lastTx && lastTx !== "error") && <p style={{ display: "inline-block" }}>{lastTx}</p>}

                <div>
                    <p>
                        <button className="smallblock" onClick={
                            () => dispatch(push('/'))
                        } >Logout</button>
                    </p>
                </div>
            </div>
        </div>
    )
}