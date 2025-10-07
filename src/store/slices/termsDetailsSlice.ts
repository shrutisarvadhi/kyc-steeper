// src/redux/slices/termsDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TermsDetailsState {
  currency: string;
  dayTerms: string;
  termName: string;
  extPercent: string;
  rapPercent: string;
  extraDollar: string;
  creditLimit: string;
  memoLimit: string;
  default: boolean;
  aadatParty1: string;
  aadatComm1: string;
  broker1: string;
  brokerComm1: string;
}

const initialState: TermsDetailsState = {
  currency: '',
  dayTerms: '',
  termName: '',
  extPercent: '',
  rapPercent: '',
  extraDollar: '',
  creditLimit: '',
  memoLimit: '',
  default: false,
  aadatParty1: '',
  aadatComm1: '',
  broker1: '',
  brokerComm1: '',
};

const termsDetailsSlice = createSlice({
  name: 'termsDetails',
  initialState,
  reducers: {
    setTermsDetails: (state, action: PayloadAction<Partial<TermsDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetTermsDetails: () => initialState,
  },
});

export const { setTermsDetails, resetTermsDetails } = termsDetailsSlice.actions;
export default termsDetailsSlice.reducer;