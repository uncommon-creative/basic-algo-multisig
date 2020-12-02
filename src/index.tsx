import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './store/index';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import * as serviceWorker from './serviceWorker';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store'
import { MainPage, NewMultisigAddress, NewTransaction,ConfirmTransaction, LoadBlob, FundMsig } from './pages';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history as any}>
        {/* <App /> */}
        <Switch>
          <Route exact path="/" render={() => <App/>} />
          <Route exact path="/index"render={() => <MainPage/>} />
          <Route exact path="/multisig/fund"render={() => <FundMsig/>} />
          <Route exact path="/transaction/init"render={() => <NewMultisigAddress/>} />
          <Route exact path="/transaction/new"render={() => <NewTransaction/>} />
          <Route exact path="/transaction/load"render={() => <LoadBlob/>} />
          <Route exact path="/transaction/confirm"render={() => <ConfirmTransaction/>} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
