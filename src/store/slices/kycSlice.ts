import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetBasicDetails } from './basicDetailsSlice';
import { resetTermsDetails } from './termsDetailsSlice';
import { resetUserDetails } from './userDetailsSlice';
import { resetAddressDetails } from './addressDetailsSlice';

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
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<string>) => {
      state.currentStep = action.payload;
    },
    setPartyCode: (state, action: PayloadAction<string | null>) => {
      state.partyCode = action.payload;
    },
    resetAll: () => initialState,
  },
});

// Thunk to reset all slices
export const resetAll = () => (dispatch: any) => {
  dispatch(kycSlice.actions.resetAll());
  dispatch(resetBasicDetails());
  dispatch(resetTermsDetails());
  dispatch(resetUserDetails());
  dispatch(resetAddressDetails());
};

export const { setIsEditing, setCurrentStep, setPartyCode } = kycSlice.actions;
export default kycSlice.reducer;