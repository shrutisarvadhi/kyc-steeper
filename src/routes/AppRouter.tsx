import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from '../App';
import BasicDetailsForm from '../Components/Forms/BasicDetailsForm';
import TermsDetailsForm from '../Components/Forms/TermsDetailsForm';
import UserDetailsForm from '../Components/Forms/UserDetailsForm';
import AddressDetailsForm from '../Components/Forms/AddressDetailsForm';
import LoginPage from '../Components/LoginPage';
import UserListPage from '../Components/Forms/UserListPage';
import ProtectedRoute from './ProtectedRoute';
import StepGuard from './StepGuard';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'basic',
        element: <Navigate to="/" replace />,
      },
      {
        index: true,
        element: (
          <StepGuard step="basic">
            <BasicDetailsForm />
          </StepGuard>
        ),
      },
      {
        path: 'terms',
        element: (
          <StepGuard step="terms">
            <TermsDetailsForm />
          </StepGuard>
        ),
      },
      {
        path: 'user',
        element: (
          <StepGuard step="user">
            <UserDetailsForm />
          </StepGuard>
        ),
      },
      {
        path: 'address',
        element: (
          <StepGuard step="address">
            <AddressDetailsForm />
          </StepGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <StepGuard step="users">
            <UserListPage />
          </StepGuard>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}