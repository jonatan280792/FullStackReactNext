import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './index';
import { getProducts, getProductById, setTransactions } from '@/app/services/productService';
import { TransactionPayload } from '../interfaces/product';

interface Product {
  id: string;
  name: string;
  price: number;
  priceIva: number;
  description: string;
}

interface ProductsState {
  list: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  transactionSuccess: boolean;
  transactionLoading: boolean;
}

const initialState: ProductsState = {
  list: [],
  product: null,
  loading: false,
  error: null,
  transactionSuccess: false,
  transactionLoading: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.list = action.payload;
      state.loading = false;
    },
    fetchProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductByIdSuccess: (state, action: PayloadAction<Product>) => {
      state.product = action.payload;
      state.loading = false;
    },
    fetchProductByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Transacción
    createTransactionStart: (state) => {
      state.transactionLoading = true;
      state.transactionSuccess = false;
      state.error = null;
    },
    createTransactionSuccess: (state) => {
      state.transactionLoading = false;
      state.transactionSuccess = true;
    },
    createTransactionFailure: (state, action: PayloadAction<string>) => {
      state.transactionLoading = false;
      state.transactionSuccess = false;
      state.error = action.payload;
    },
    clearTransactionState: (state) => {
      state.transactionSuccess = false;
      state.transactionLoading = false;
    }
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  fetchProductByIdSuccess,
  fetchProductByIdFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransactionFailure,
  clearTransactionState
} = productsSlice.actions;

export const fetchProductsThunk = (): AppThunk => async (dispatch) => {
  dispatch(fetchProductsStart());
  try {
    const response = await getProducts();
    dispatch(fetchProductsSuccess(response.data));
  } catch (error) {
    const errorMessage = (error as Error).message || 'Error al obtener productos';
    dispatch(fetchProductsFailure(errorMessage));
  }
};

export const fetchProductByIdThunk = (id: string): AppThunk => async (dispatch) => {
  dispatch(fetchProductsStart());
  try {
    const response = await getProductById(id);
    dispatch(fetchProductByIdSuccess(response.data));
  } catch (error) {
    const errorMessage = (error as Error).message || 'Error al obtener producto';
    dispatch(fetchProductByIdFailure(errorMessage));
  }
};

export const createTransactionThunk = (payloadData: any): AppThunk => async (dispatch) => {
  dispatch(createTransactionStart());
  try {
    const payload: TransactionPayload = {
      amount_in_cents: Number(payloadData.price) * 100,
      currency: 'COP',
      customer_email: payloadData.email,
      reference: payloadData.reference,
      payment_method: {
        type: 'NEQUI',
        phone_number: payloadData.phone_number,
        payment_description: payloadData.reference,
        user_type: 'customer',
      },
    };

    // Enviar transacción a la API de Wompi
    const response = await setTransactions(payload);
    console.log('Transacción exitosa:', response);
    dispatch(createTransactionSuccess());
  } catch (error) {
    const errorMessage = (error as Error).message || 'Error al crear transacción';
    dispatch(createTransactionFailure(errorMessage));
  }
};

export default productsSlice.reducer;
