import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas'
import { reducer as algorandReducer, AlgorandInterface } from './algorand';
import { UIInterface, reducer as uiReducer } from './ui';

export const history = createBrowserHistory();

export interface AppReduxStateInterface {
    algorand: AlgorandInterface,
    ui: UIInterface,
    router: any
};

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    middleware: [routerMiddleware(history), ...getDefaultMiddleware(), sagaMiddleware],
    reducer: {
        router: connectRouter(history) as any,
        ui: uiReducer,
        algorand: algorandReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

sagaMiddleware.run(rootSaga);