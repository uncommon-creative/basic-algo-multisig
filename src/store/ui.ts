import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppReduxStateInterface } from './index';


export interface UIInterface {
    loading: boolean;
    error: boolean;

}

export const UISlice = createSlice({
    name: "ui",
    initialState: {
        loading: false,
        error: false
    },
    reducers: {
        loading(state, action: PayloadAction<boolean>) { state.loading = action.payload },
        error(state, action: PayloadAction<boolean>) { state.error = action.payload }

    }
});


export const { actions, reducer } = UISlice;
export const { loading } = actions;
export const selectors = {
    isLoading: (state: AppReduxStateInterface) => state.ui.loading,
    isError: (state: AppReduxStateInterface) => state.ui.error
};


