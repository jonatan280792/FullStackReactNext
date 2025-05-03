import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  data: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    transactionRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    transactionSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.data = action.payload;
      localStorage.setItem('transaction', JSON.stringify(action.payload));
    },
    transactionFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  transactionRequest,
  transactionSuccess,
  transactionFailure,
} = transactionSlice.actions;

export default transactionSlice.reducer;
