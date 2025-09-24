// src/redux/slices/basicDetailsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BasicDetailsState {
  partyCode: string;
  category: string;
  companyIndividual: string;
  businessType: string;
  gstNo: string;
  primaryContact: string;
  primaryEmail: string;
  secondaryEmail: string;
  birthDate: string;
  country: string;
  mobile: string;
  phone: string;
  fax: string;
  salesPerson: string;
  assistantSalesPerson: string;
  remark: string;
  registrationDate: string;
  department: string;
  active: boolean;
}

const initialState: BasicDetailsState = {
  partyCode: '',
  category: '',
  companyIndividual: '',
  businessType: '',
  gstNo: '',
  primaryContact: '',
  primaryEmail: '',
  secondaryEmail: '',
  birthDate: '',
  country: '',
  mobile: '',
  phone: '',
  fax: '',
  salesPerson: '',
  assistantSalesPerson: '',
  remark: '',
  registrationDate: '',
  department: '',
  active: false,
};

const basicDetailsSlice = createSlice({
  name: 'basicDetails',
  initialState,
  reducers: {
    setBasicDetails: (state, action: PayloadAction<Partial<BasicDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetBasicDetails: () => initialState,
  },
});

export const { setBasicDetails, resetBasicDetails } = basicDetailsSlice.actions;
export default basicDetailsSlice.reducer;