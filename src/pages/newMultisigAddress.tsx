import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';
import * as UIStore from '../store/ui';

export function NewMultisigAddress() {
    const currentAddress = useSelector(AlgorandStore.selectors.currentAddress);
    const multisigAddress = useSelector(AlgorandStore.selectors.multisigParams);
    let [owner1,] = useState(currentAddress);
    let [owner2, setowner2] = useState("");
    let [owner3, setowner3] = useState("");
    const dispatch = useDispatch();
    const isError = useSelector(UIStore.selectors.isError);

    useEffect(() => {
        console.log('Current', currentAddress);
        dispatch(UIStore.actions.error(false));

        if (currentAddress === "unknown address" || currentAddress === "") {
            dispatch(push('/'));
        }
    }, [dispatch]);


    return (
        <div style={{ textAlign: "center" }}>

            <h1>
                Enter Algorand Addresses
            </h1>
            <div style={{
                width: "60%",
                marginRight: "auto",
                marginLeft: "auto",
                border: "1px solid #000"
            }}>
                <p>
                    <b>
                        <label htmlFor="owner1">Owner 1</label>
                    </b>
                    <input disabled value={owner1} className="inputblock" id="owner1" type="text" />
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
                    <button onClick={async () => {
                        dispatch(AlgorandStore.actions.willMultiSignTransaction({
                            owner1: owner1,
                            owner2: owner2,
                            owner3: owner3,
                        }));
                    }} className="smallblock">Create</button>
            {isError && <div> <h2><p><b> <span className="label danger">An error has occurred</span></b></p> </h2></div>}

                    {multisigAddress.addr && (
                        <button className="smallblock" onClick={
                            () => dispatch(push('/transaction/new'))
                        } >Next</button>)
                    }
                </p>
            </div>
            {multisigAddress.addr && (
                <div>
                    <b>Multisig Address: {multisigAddress.addr}</b>
                </div>


            )}
        </div>
    )
}