import { push } from 'connected-react-router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as AlgorandStore from '../store/algorand';
import * as UIStore from '../store/ui';

export function LoadBlob() {
    const dispatch = useDispatch();
    let [blob, setBlob] = useState("");
    const fstBlob = useSelector(AlgorandStore.selectors.fstBlob);
    useEffect(() => {
        dispatch(UIStore.actions.error(false));
    }, []);
    return (
        <div style={{ textAlign: "center" }}>
            <h1>
                Paste the TX blob here
            </h1>
            <div> <p><textarea value={blob} onChange={(e) => { setBlob(e.target.value) }}
                rows={12} cols={80}>
            </textarea>
            </p>
                <p><button className="smallblock" onClick={() => {
                    dispatch(AlgorandStore.actions.setFirstBlob(blob));
                    dispatch(push('/transaction/confirm'))
                }}>Parse TX blob and next</button>
                </p>

                {/* {
                    fstBlob && <div>
                        <button className="smallblock" onClick={
                            () => {
                                dispatch(push('/transaction/confirm'))
                            }
                        }>Next</button>
                    </div>
                } */}
                <p>
                    <button className="smallblock" onClick={
                        () => dispatch(push('/'))
                    } >Logout</button>
                </p>
            </div>
        </div>
    )
}