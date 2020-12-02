
import { push } from 'connected-react-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';
import * as UIStore from '../store/ui';

require('buffer');
export function MainPage() {
    // const isAlgoSignerConnected = useSelector(AlgorandStore.selectors.isConnected);
    const currentAddress = useSelector(AlgorandStore.selectors.currentAddress);
    const keyError = useSelector(AlgorandStore.selectors.generatedKeyError);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(UIStore.actions.error(false));
    }, []);
    return (

        <div style={{ textAlign: "center" }}>
            {   keyError && <div> <p><b>Key generation failed</b></p> </div>}
            { (keyError === "") &&
                <div>
                    <div>
                        <h3>
                            Current Address: {currentAddress}
                        </h3>
                    </div>
                    <div>
                        <p>
                            <button className="smallblock" onClick={
                                () => dispatch(push('/transaction/init'))
                            } >Initiate new msig TX</button>
                        </p>
                        <p>
                            <button className="smallblock" onClick={
                                () => dispatch(push('/transaction/load'))
                            } >Approve msig TX</button>
                        </p>
                        <p>
                            <button className="smallblock" onClick={
                                () => dispatch(push('/multisig/fund'))
                            } >Fund msig</button>
                        </p>
                        <p>
                            <button className="smallblock" onClick={
                                () => dispatch(push('/'))
                            } >Logout</button>
                        </p>
                    </div>
                </div>
            }
        </div>)


}