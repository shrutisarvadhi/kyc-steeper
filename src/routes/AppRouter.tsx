import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import BasicDetailsForm from '../pages/BasicDetailsForm';
import TermsDetailsForm from '../pages/TermsDetailsForm';
import UserDetailsForm from '../pages/UserDetailsForm';
import AddressDetailsForm from '../pages/AddressDetailsForm';
import LoginPage from '../pages/LoginPage';
import UserListPage from '../pages/UserListPage';
import ProtectedRoute from './ProtectedRoute';
import StepGuard from './StepGuard';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <StepGuard step="basic">
                <BasicDetailsForm />
              </StepGuard>
            }
          />
          <Route path="basic" element={<Navigate to="/" replace />} />
          <Route
            path="terms"
            element={
              <StepGuard step="terms">
                <TermsDetailsForm />
              </StepGuard>
            }
          />
          <Route
            path="user"
            element={
              <StepGuard step="user">
                <UserDetailsForm />
              </StepGuard>
            }
          />
          <Route
            path="address"
            element={
              <StepGuard step="address">
                <AddressDetailsForm />
              </StepGuard>
            }
          />
          <Route
            path="users"
            element={
              <StepGuard step="users">
                <UserListPage />
              </StepGuard>
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}