import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useFormState } from '../Contexts/FormStateContext';

const stepOrder = ['basic', 'terms', 'user', 'address', 'users'];

export default function StepGuard({ step, children }) {
  const { state } = useFormState();
  const [searchParams] = useSearchParams();
  const partyCode = searchParams.get('partyCode');
  const [loading, setLoading] = useState(!!partyCode);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (step === 'users') {
    return children;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-purple-600">Validating access...</div>
      </div>
    );
  }

  const currentStepIndex = stepOrder.indexOf(state.currentStep);
  const requestedStepIndex = stepOrder.indexOf(step);

  const allowed = requestedStepIndex <= currentStepIndex;

  if (!allowed) {
    return <Navigate to={`/${state.currentStep}${partyCode ? `?partyCode=${partyCode}` : ''}`} replace />;
  }

  return children;
}