// src/Contexts/PartyCodeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useFormState } from './FormStateContext';

const PartyCodeContext = createContext();

export function PartyCodeProvider({ children }) {
  const { state, dispatch } = useFormState();
  const [partyCode, setPartyCode] = useState(state.partyCode);

  const updatePartyCode = (code) => {
    setPartyCode(code);
    dispatch({ type: 'SET_PARTY_CODE', payload: code });
  };

  return (
    <PartyCodeContext.Provider value={{ partyCode, setPartyCode: updatePartyCode }}>
      {children}
    </PartyCodeContext.Provider>
  );
}

export function usePartyCode() {
  const context = useContext(PartyCodeContext);
  if (!context) {
    throw new Error('usePartyCode must be used within a PartyCodeProvider');
  }
  return context;
}