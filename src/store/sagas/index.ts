import { all } from 'redux-saga/effects';
import { willLoadSaga as algorandWillLoadSagas } from './algorand';


export default function* rootSaga() {
  console.log('in root saga')
  yield all([
    algorandWillLoadSagas()
  ])
}