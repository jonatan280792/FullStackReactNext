import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from './index';
import { loginUser } from '@/app/services/userService';
import { sessionPersistence } from '@/app/utils/sessionService';

interface UserState {
  userData: any | null;
  isAuthenticated: boolean;
  errorMessage: string | null;
}

const initialState: UserState = {
  userData: null,
  isAuthenticated: false,
  errorMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isAuthenticated = false;
    },
    loginSuccess: (state, action) => {
      state.userData = action.payload.data;
      state.isAuthenticated = true;
      state.errorMessage = null;

      sessionPersistence.set('userData', action.payload.data);
      sessionPersistence.set('token', action.payload.data.token);
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.errorMessage = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userData = null;
      state.errorMessage = null;
      sessionPersistence.deleteAll();
    }
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = userSlice.actions;

export const loginUserThunk = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(loginRequest());
  try {
    const response = await loginUser(email, password);
    dispatch(loginSuccess(response));
  } catch (error) {
    dispatch(loginFailure('Credenciales inválidas'));
  }
};

export const checkUserData = () => (dispatch: AppDispatch) => {
  const userData = sessionPersistence.get('userData');
  const token = sessionPersistence.get('token');

  if (userData && token) {
    dispatch(loginSuccess({ data: { ...userData, token } }));
  }
};

export default userSlice.reducer;
