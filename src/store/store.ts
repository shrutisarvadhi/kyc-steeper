// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import kycReducer from './slices/kycSlice';
import basicDetailsReducer from './slices/basicDetailsSlice';
import termsDetailsReducer from './slices/termsDetailsSlice';
import userDetailsReducer from './slices/userDetailsSlice';
import addressDetailsReducer from './slices/addressDetailsSlice';
import userListReducer from './slices/userListSlice';

export const store = configureStore({
  reducer: {
    kyc: kycReducer,
    basicDetails: basicDetailsReducer,
    termsDetails: termsDetailsReducer,
    userDetails: userDetailsReducer,
    addressDetails: addressDetailsReducer,
    userList: userListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;