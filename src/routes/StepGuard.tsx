import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setIsEditing } from '../store/slices/kycSlice';

const stepOrder = ['basic', 'terms', 'user', 'address', 'users'];

export default function StepGuard({ step, children }) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentStep } = useSelector((state: RootState) => state.kyc);
  const [searchParams] = useSearchParams();
  const partyCode = searchParams.get('partyCode');
  const [loading, setLoading] = useState(!!partyCode);

  useEffect(() => {
    if (step === 'users') {
      dispatch(setIsEditing(false));
    }
    setLoading(false);
  }, [step, dispatch]);

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

  const currentStepIndex = stepOrder.indexOf(currentStep);
  const requestedStepIndex = stepOrder.indexOf(step);
  const allowed = requestedStepIndex <= currentStepIndex;

  if (!allowed) {
    const redirectStep = currentStep === 'basic' ? '' : currentStep;
    return <Navigate to={`/${redirectStep}${partyCode ? `?partyCode=${partyCode}` : ''}`} replace />;
  }

  return children;
}
