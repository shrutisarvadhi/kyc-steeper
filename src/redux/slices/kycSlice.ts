// src/redux/slices/kycSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KycState {
  isEditing: boolean;
  currentStep: string;
  partyCode: string | null;
}

const initialState: KycState = {
  isEditing: false,
  currentStep: 'basic',
  partyCode: null,
};

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setIsEditing(state, action: PayloadAction<boolean>) {
      state.isEditing = action.payload;
    },
    setCurrentStep(state, action: PayloadAction<string>) {
      state.currentStep = action.payload;
    },
    setPartyCode(state, action: PayloadAction<string | null>) {
      state.partyCode = action.payload;
    },
    resetAll(state) {
      state.isEditing = false;
      state.currentStep = 'basic';
      state.partyCode = null;
    },
  },
});

export const { setIsEditing, setCurrentStep, setPartyCode, resetAll } = kycSlice.actions;
export default kycSlice.reducer;