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
      </header>
    </div >
  );
}

export default App;
