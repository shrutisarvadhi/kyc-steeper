import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  partyCode: string;
  companyIndividual: string;
  primaryEmail: string;
  mobile: string;
  currency: string;
  dayTerms: string;
  username: string;
  email: string;
  role: string;
  addressType: string;
  contactNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  defaultAddress: boolean;
  createdAt: string; // Changed to string for serializable ISO format
  updatedAt: string; // Changed to string for serializable ISO format
}

interface UserListState {
  users: User[];
  loading: boolean;
}

const initialState: UserListState = {
  users: [],
  loading: true,
};

const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { setUsers, setLoading, deleteUser } = userListSlice.actions;
export default userListSlice.reducer;