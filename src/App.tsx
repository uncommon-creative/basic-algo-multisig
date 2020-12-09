import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import * as AlgorandStore from './store/algorand';
import * as UIStore from './store/ui';


function App() {
  const dispatch = useDispatch();
  let [mnemonics, setMno] = useState("");
  useEffect(() => {
    dispatch(UIStore.actions.error(false));
  });
  return (
    <div className="App" >
      <header className="App-header">
        <h2>Paste your mnemonic words</h2>
        <textarea value={mnemonics} onChange={(e) => { setMno(e.target.value) }} className="areablock" rows={4} cols={50}></textarea>
        <button className="smallblock" onClick={
          () => {
            dispatch(AlgorandStore.actions.willGenerateAccountPair(mnemonics));
          }
        }>Log in</button>

        <p style={{
          fontSize: "14px"
        }}>

        </p>
      </header>
      <div className="multiline">
        <i>
          <p>A proof-of-concept escrow based on Algorand multisig</p>
              This code is for learning and testing purposes only and in no way should be used in production systems. It is based on the assumption to connect on the Algorand testnet network. So DO NOT USE any of your mainnet private keys or keys which are somehow connected to real funds, but instead generate new disposable keys/seeds to be used here only.
              This code is released under the MIT license.
          <p>
            Check LICENSE (<a href="https://github.com/uncommon-creative/basic-algo-multisig">https://github.com/uncommon-creative/basic-algo-multisig</a>) file for details.

          </p>
        </i>
      </div>
    </div >
  );
}

export default App;
