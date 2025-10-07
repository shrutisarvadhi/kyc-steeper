import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserDetailsState {
  terms: string;
  role: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  location: string;
  apiUser: boolean;
  discountMumbai: string;
  discountHK: string;
  discountNY: string;
  discountBelgium: string;
}

const initialState: UserDetailsState = {
  terms: '',
  role: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  mobile: '',
  location: '',
  apiUser: false,
  discountMumbai: '',
  discountHK: '',
  discountNY: '',
  discountBelgium: '',
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<Partial<UserDetailsState>>) => {
      return { ...state, ...action.payload };
    },
    resetUserDetails: () => initialState,
  },
});

export const { setUserDetails, resetUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;