'connected-react-router';
import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';
import * as UIStore from '../store/ui';
import {  getMsigTXparams } from '../store/api/algorand';

export function ConfirmTransaction() {
    const txId = useSelector(AlgorandStore.selectors.sentTxId);
    const isLoading = useSelector(UIStore.selectors.isLoading);
    const isError = useSelector(UIStore.selectors.isError);
    const dispatch = useDispatch();
    let fstBlob = useSelector(AlgorandStore.selectors.fstBlob);

    let [owner1, setOwner1] = useState("");
    let [owner2, setOwner2] = useState("");
    let [owner3, setOwner3] = useState("");

    let [, setVersion] = useState(1);
    let [, setThr] = useState(2);
    let [snd, setSnd] = useState("");
    let [rcv, setRcv] = useState("");

    let [amount, setAmount] = useState(0);
    let [decoded, setDecoded] = useState(false);

    let sk = useSelector(AlgorandStore.selectors.sk);

    useEffect(() => {
        dispatch(UIStore.actions.error(false));
        let params = getMsigTXparams(fstBlob);
        if (params) {
            setOwner1(params.owner1);
            setOwner2(params.owner2);
            setOwner3(params.owner3);
            setVersion(params.version);
            setThr(params.threshold);
            setSnd(params.from);
            setRcv(params.to);
            setAmount(params.amount);
            setDecoded(true);
        }
        else {
            dispatch(UIStore.actions.error(true));
        }
    }, [dispatch, fstBlob]);
    return (

        <div style={{ textAlign: "center" }}>
            { decoded &&
                <div style={{ textAlign: "center" }}><p>
                    <b>
                        <label htmlFor="owner1">Owner1</label>
                    </b>
                    <input disabled onChange={(e) => setOwner1(e.target.value)} value={owner1} className="inputblock" id="owner1" type="text" />
                </p>
                    <p>
                        <b>
                            <label htmlFor="owner2">Owner2</label>
                        </b>
                        <input disabled onChange={(e) => setOwner2(e.target.value)} value={owner2} className="inputblock" id="owner2" type="text" />
                    </p>
                    <p>
                        <b>
                            <label htmlFor="owner3 ">Owner3</label>
                        </b>
                        <input disabled onChange={(e) => setOwner3(e.target.value)} value={owner3} className="inputblock" id="owner3" type="text" />
                    </p>
                    <h2>Transaction params</h2>
                    <p>Amount: {amount}</p>
                    <p>From: {snd}</p>
                    <p>To: {rcv}</p>
                    <div >
                        <button className="smallblock"
                            disabled={isLoading} onClick={
                                () => {
                                    dispatch(AlgorandStore.actions.willconfirmAndSignTX({
                                        msigParams: {
                                            owner1,
                                            owner2,
                                            owner3,
                                        },
                                        sk,
                                        blob: fstBlob
                                    }));
                                }
                            }>Confirm and send</button>
                    </div>
                </div>
            }
            {isError && <div> <h2><p><b> <span className="label danger">An error has occurred</span></b></p> </h2></div>}

            {isLoading && <p style={{ display: "inline-block" }} className="loader"></p>}

            <div> <button className="smallblock" onClick={() => dispatch(push('/'))}>
                Back to login page
                </button>
            </div>

            {
                ((txId) && (
                    <div>
                        {txId.txId}
                    </div>))

            }
            <div>
                <p>
                    <button className="smallblock" onClick={
                        () => dispatch(push('/'))
                    } >Logout</button>
                </p>
            </div>
        </div>
    )
}