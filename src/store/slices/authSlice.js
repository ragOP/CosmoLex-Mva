import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  twoFactorRequired: false,
  tempLoginData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      state.twoFactorRequired = false;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = action.payload;
    },
    setTwoFactorRequired: (state, action) => {
      state.twoFactorRequired = true;
      state.tempLoginData = action.payload;
      state.isLoading = false;
    },
    twoFactorSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.twoFactorRequired = false;
      state.tempLoginData = null;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.twoFactorRequired = false;
      state.tempLoginData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setTwoFactorRequired,
  twoFactorSuccess,
  logout,
  clearError,
  setUser,
} = authSlice.actions;

export default authSlice.reducer; 