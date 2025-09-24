// src/Components/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useFormState } from '../Contexts/FormStateContext';

const stepOrder = ['basic', 'terms', 'user', 'address', 'users'];

export default function Navbar() {
  const location = useLocation();
  const { state } = useFormState();

  const currentStepIndex = stepOrder.indexOf(state.currentStep);

  const tabs = [
    { name: 'Basic Details', path: '/', step: 'basic' },
    { name: 'Terms Details', path: '/terms', step: 'terms' },
    { name: 'User Details', path: '/user', step: 'user' },
    { name: 'Address Details', path: '/address', step: 'address' },
    { name: 'All Users Details', path: '/users', step: 'users' },
  ];

  return (
    <div className="flex space-x-8 border-b border-gray-200 bg-gray-100 pl-5">
      {tabs.map((tab) => {
        const isActive =
          location.pathname === tab.path ||
          (location.pathname === '/' && tab.path === '/');
        const tabStepIndex = stepOrder.indexOf(tab.step);
        const isDisabled = tab.step !== 'users' && tabStepIndex > currentStepIndex;

        return isDisabled ? (
          <span
            key={tab.path}
            className="py-4 px-1 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            {tab.name}
          </span>
        ) : (
          <Link
            key={tab.path}
            to={`${tab.path}${state.partyCode ? `?partyCode=${state.partyCode}` : ''}`}
            className={`py-4 px-1 border-b-2 text-sm font-medium ${
              isActive
                ? 'border-blue-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}