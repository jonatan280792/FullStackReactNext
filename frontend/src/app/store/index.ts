import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import transactionReducer from './transactionSlice';
import productsReducer from './productsSlice';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; // `dispatch` ya está correctamente tipado para manejar thunks

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
