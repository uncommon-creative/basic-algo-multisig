import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAlgoSigner } from '../common';
import * as AlgorandStore from '../store/algorand';


export function AlgoAccountsSelect() {
    let [accounts, setAccounts] = useState([]);
    let dispatch = useDispatch();
    useEffect(() => {
        let func = async () => {
            let accs = await getAlgoSigner().accounts({
                ledger: 'TestNet'
            });
            dispatch(AlgorandStore.actions.setCurrentAddress(accs[0] ? accs[0].address: "unknown address"));
            setAccounts(accs);
        };
        func();
    }, []);
    return (
        <div style={{ margin: 40 }}>

            <h2 style={{ textAlign: "center" }}>
                Account selection
            </h2>

            <select onChange={(e) => { dispatch(AlgorandStore.actions.setCurrentAddress(e.target.value)) }} className="smallblock">
                {accounts.map((acc: any, i) => <option key={String(i)} value={acc.address} > {acc.address}</option>)}
            </select>
        </div>
    )
} 