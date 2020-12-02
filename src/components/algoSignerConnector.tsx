import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';

export const AlgoSignerConnector = (props: { isAlgoSigner: boolean }) => {

    const [, setSigner] = useState(props.isAlgoSigner);
    const dispatch = useDispatch();
    const isAlgoSignerConnected = useSelector(AlgorandStore.selectors.isConnected)
    useEffect(() => {
        setSigner(props.isAlgoSigner);
    }, [props.isAlgoSigner]);

    return (
        <div>
            <button className="smallblock" onClick={() => {
                dispatch(AlgorandStore.actions.willConnectToAlgoSigner());
                dispatch(push('/index'));
            }
            }
                disabled={isAlgoSignerConnected}
            > {!isAlgoSignerConnected ? (<p>Connect</p>) : (<p>Connected</p>)}</button>
            <p>{isAlgoSignerConnected && "You App is connected"}
            </p>
        </div>)
}