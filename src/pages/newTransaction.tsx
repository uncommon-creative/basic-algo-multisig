import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';
import Modal from 'react-modal';
import * as UIStore from '../store/ui';

const customStyles = {
    content: {
        "justifyContent": "center",
        width: "60%",
        height: "75%",
        top: '20%',
        left: '20%',
        right: '20%',
        bottom: '20%',
    }
};
export function NewTransaction() {
    const dispatch = useDispatch();
    let [sum, setSum] = useState(0);
    let msigParams = useSelector(AlgorandStore.selectors.multisigParams);
    let fstBlob = useSelector(AlgorandStore.selectors.fstBlob);
    let sk = useSelector(AlgorandStore.selectors.sk);
    let [msig, setMsig] = useState(msigParams.addr);
    let [ben, setBen] = useState("");
    let [showBlob, SetShowBlob] = useState(false);
    const isError = useSelector(UIStore.selectors.isError);
    const isLoading = useSelector(UIStore.selectors.isLoading);

    useEffect(() => {
        dispatch(UIStore.actions.error(false));
        if (fstBlob !== "") {
            SetShowBlob(true);
        }
    }, [fstBlob])
    const toggleModal = () => {
        console.log('toggled', showBlob);
        SetShowBlob(!showBlob);
    }

    return (
        <div style={{ textAlign: "center" }}>

            <h1>
                Enter Transaction Data
            </h1>
            <div className="grid-container" style={{

                textAlign: "center",
                width: "80%",
                marginRight: "auto",
                marginLeft: "auto",
                border: "1px solid #000"
            }}>
                <p>
                    <b>
                        <label htmlFor="msig">Msig</label>
                    </b>
                </p>
                <p>
                    <input value={msig || ""} onChange={
                        (e) => setMsig(e.target.value)
                    } className="inputblock" id="msig" type="text" />

                </p>
                <p>
                    <b>
                        <label htmlFor="benef">Beneficiary</label>
                    </b>
                </p>
                <p>
                    <input value={ben} onChange={(e) => setBen(e.target.value)} className="inputblock" id="benef" type="text" />
                </p>
                <p>
                    <b>
                        <label htmlFor="sum">Amount (in micro Algos)</label>
                    </b>
                </p>
                <p>
                    <input onChange={(e) => setSum(Number(e.target.value))} value={sum} className="inputblock" id="sum" type="text" />
                </p>
                <div>
                    <p>
                        <button className="smallblock" onClick={() => {
                            dispatch(AlgorandStore.actions.willFirstSignTransaction({
                                msigParams: msigParams,
                                addr: msig,
                                beneficiary: ben,
                                sk,
                                amount: sum
                            }))
                        }} >Sign and show blob</button>
                    </p>
                </div>
                {isError && <div> <h2><p><b> <span className="label danger">An error has occurred</span></b></p> </h2></div>}

                <div>
                    <p>
                        <button className="smallblock" onClick={
                            () => dispatch(push('/'))
                        } >Logout</button>
                    </p>
                </div>
                <button className="smallblock" onClick={() => {
                    dispatch(push('/index'))
                }}>Back to main </button>
            </div>
            {
                <Modal ariaHideApp={false} isOpen={showBlob} onRequestClose={toggleModal} style={customStyles}
                >
                    <div style={{
                        width: "100%",
                        height: "70%",
                        wordWrap: "break-word"
                    }}>
                        {fstBlob}
                    </div>
                    <button onClick={() => {
                        if (fstBlob !== "")
                            navigator.clipboard.writeText(fstBlob);
                    }} className="smallblock">Copy to clipboard</button>
                    <button onClick={toggleModal} className="smallblock">Close</button>

                </Modal>

            }
        </div>
    )
}