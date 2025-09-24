import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  currentStep: 'basic',
  isEditing: false,
  partyCode: null,
  basic: null,
  terms: null,
  user: null,
  address: null,
};

const FormStateContext = createContext();

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_IS_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_PARTY_CODE':
      return { ...state, partyCode: action.payload };
    case 'SET_BASIC':
      return { ...state, basic: action.payload };
    case 'SET_TERMS':
      return { ...state, terms: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ADDRESS':
      return { ...state, address: action.payload };
    case 'RESET_ALL':
      return { ...initialState };
    default:
      return state;
  }
};

export function FormStateProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return (
    <FormStateContext.Provider value={{ state, dispatch }}>
      {children}
    </FormStateContext.Provider>
  );
}

export function useFormState() {
  const context = useContext(FormStateContext);
  if (!context) {
    throw new Error('useFormState must be used within a FormStateProvider');
  }
  return context;
}