import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddressDetailsState {
  addressType: string;
  companyName: string;
  contactNo: string;
  unit: string;
  building: string;
  street: string;
  landmark: string;
  area: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  defaultAddress: boolean;
}

const initialState: AddressDetailsState = {
  addressType: '',
  companyName: '',
  contactNo: '',
  unit: '',
  building: '',
  street: '',
  landmark: '',
  area: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  defaultAddress: false,
};

const addressDetailsSlice = createSlice({
  name: 'addressDetails',
  initialState,
  reducers: {
    setAddressDetails: (state, action: PayloadAction<Partial<AddressDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetAddressDetails: () => initialState,
  },
});

export const { setAddressDetails, resetAddressDetails } = addressDetailsSlice.actions;
export default addressDetailsSlice.reducer;