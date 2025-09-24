// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import kycReducer from './slices/kycSlice';
import basicDetailsReducer from './slices/basicDetailsSlice';

export const store = configureStore({
  reducer: {
    kyc: kycReducer,
    basicDetails: basicDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;