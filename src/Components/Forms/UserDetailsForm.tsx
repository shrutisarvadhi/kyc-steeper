import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormActionButtons from '../FormComponents/FormActionButton';
import TextInput from '../FormComponents/TextInput';
import SelectInput from '../FormComponents/SelectInput';
import CheckboxInput from '../FormComponents/CheckboxInput';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from "../../Database/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { usePartyCode } from "../../Contexts/PartyCodeContext";
import { useFormState } from '../../Contexts/FormStateContext';

// --- Tailwind classes ---
const containerClass = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";
const titleClass = "text-xl font-semibold mb-4";
const subtitleClass = "text-lg font-medium mb-4";
const smallTextClass = "text-xs text-gray-600 mb-2";
const grid3Class = "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6";
const grid2Class = "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6";
const grid4Class = "grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6";

const validationSchema = Yup.object({
  terms: Yup.string().required('Terms is required'),
  role: Yup.string().required('Role is required'),
  username: Yup.string().required('User Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),

  mobile: Yup.string()
    .nullable()
    .test('is-valid-mobile', 'Mobile must be 10 digits', (value) => {
      return !value || /^[0-9]{10}$/.test(value);
    }),

  location: Yup.string(),

  apiUser: Yup.boolean(),

  discountMumbai:Yup.string()
      .nullable()
      .test("is-decimal", "must be a positive number", value =>
        !value || /^[0-9]*\.?[0-9]+$/.test(value)
      ),
  discountHK: Yup.string()
      .nullable()
      .test("is-decimal", "must be a positive number", value =>
        !value || /^[0-9]*\.?[0-9]+$/.test(value)
      ),
  discountNY: Yup.string()
      .nullable()
      .test("is-decimal", "must be a positive number", value =>
        !value || /^[0-9]*\.?[0-9]+$/.test(value)
      ),
  discountBelgium: Yup.string()
      .nullable()
      .test("is-decimal", "must be a positive number", value =>
        !value || /^[0-9]*\.?[0-9]+$/.test(value)
      ),
});

export default function UserDetailsForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useFormState();
  const [searchParams] = useSearchParams();
  const partyCodeFromUrl = searchParams.get('partyCode');
  const [loading, setLoading] = useState(!!partyCodeFromUrl);

  const formik = useFormik({
    initialValues: state.user || {
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
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('✅ Submitted Values:', values);

      const partyCode = state.partyCode || partyCodeFromUrl;
      if (!partyCode) {
        alert('No Party Code found! Please go back and fill in Basic Details.');
        navigate('/');
        return;
      }

      try {
        const userDetailsRef = doc(db, 'kyc', partyCode, 'UserDetails', 'UserDetails');
        const saveValues = { ...values, updatedAt: new Date() };
        if (state.isEditing && !values.password) {
          delete saveValues.password;
          delete saveValues.confirmPassword;
        }
        await setDoc(userDetailsRef, saveValues, { merge: true });

        dispatch({ type: 'SET_USER', payload: values });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'address' });
        alert('User Details saved successfully!');
      } catch (error) {
        console.error('Error saving UserDetails to Firebase:', error);
        alert('Failed to save User Details.');
      }
    },
  });

  const handleSaveAndNext = async () => {
    if (formik.isSubmitting) return;

    const errors = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      true
    );

    if (Object.keys(errors).length === 0) {
      formik.setSubmitting(true);
      try {
        await formik.submitForm();
        navigate(`/address${state.partyCode ? `?partyCode=${state.partyCode}` : ''}`);
      } catch (error) {
        console.error('Error during form submission:', error);
        alert('Failed to save and proceed.');
      } finally {
        formik.setSubmitting(false);
      }
    } else {
      console.warn('Validation errors:', errors);
    }
  };

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!partyCodeFromUrl || !state.isEditing) {
        setLoading(false);
        return;
      }

      try {
        const kycDocRef = doc(db, 'kyc', partyCodeFromUrl);
        const kycDocSnap = await getDoc(kycDocRef);
        if (!kycDocSnap.exists()) {
          alert('No KYC record found for this Party Code.');
          navigate('/users');
          return;
        }

        const userSnap = await getDoc(doc(db, 'kyc', partyCodeFromUrl, 'UserDetails', 'UserDetails'));
        const userData = userSnap.exists() ? userSnap.data() : {};

        const initializedData = {
          terms: userData.terms || '',
          role: userData.role || '',
          username: userData.username || '',
          email: userData.email || '',
          password: userData.password || '',
          confirmPassword: userData.confirmPassword || '',
          mobile: userData.mobile || '',
          location: userData.location || '',
          apiUser: userData.apiUser || false,
          discountMumbai: userData.discountMumbai || '',
          discountHK: userData.discountHK || '',
          discountNY: userData.discountNY || '',
          discountBelgium: userData.discountBelgium || '',
        };

        dispatch({ type: 'SET_USER', payload: initializedData });
        setLoading(false);
      } catch (error) {
        console.error('Error loading User Details:', error);
        alert('Failed to load User Details.');
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [partyCodeFromUrl, state.isEditing, dispatch, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Loading User Details...</div>;
  }

  return (
    <form onSubmit={formik.handleSubmit} className={containerClass}>
      <h2 className={titleClass}>Login Details</h2>

      {/* First Grid */}
      <div className={grid3Class}>
        <SelectInput
          label="Terms"
          name="terms"
          options={['Standard', 'Premium']}
          formik={formik}
          required
        />
        <SelectInput
          label="Role"
          name="role"
          options={['User', 'Admin']}
          formik={formik}
          required
        />
        <TextInput
          label="User Name"
          name="username"
          type="text"
          placeholder="Enter User Name"
          formik={formik}
          required
        />
      </div>

      {/* Second Grid */}
      <div className={grid3Class}>
        <TextInput
          label="Email"
          name="email"
          type="email"
          placeholder="Enter Email"
          formik={formik}
          required
        />
        <TextInput
          label="Password"
          name="password"
          type="password"
          placeholder="Enter Password"
          formik={formik}
          required
        />
        <TextInput
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          formik={formik}
          required
        />
      </div>

      {/* Third Grid */}
      <div className={grid2Class}>
        <TextInput
          label="Mobile No"
          name="mobile"
          type="tel"
          placeholder="Enter Mobile No"
          formik={{
                ...formik,
                handleChange: (e) => {
                  const { name, value } = e.target;
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    formik.setFieldValue(name, value);
                  }
                },
                handleBlur: formik.handleBlur,
                values: formik.values,
                errors: formik.errors,
                touched: formik.touched,
              }}
        />
        <SelectInput
          label="Location"
          name="location"
          options={['Mumbai', 'Hong Kong']}
          formik={formik}
        />
      </div>

      {/* API Checkbox */}
      <CheckboxInput
        label="Is API User? (Please select this box if you want to grant API access to the user.)"
        name="apiUser"
        formik={formik}
      />
      <br/>
      {/* Additional Discount Section */}
      <h3 className={subtitleClass}>Additional Discount</h3>
      <p className={smallTextClass}>
        Kindly apply an additional discount specifically to the inventories at the designated location.
      </p>

      <div className={grid4Class}>
        <TextInput
          label="Mumbai"
          name="discountMumbai"
          type="number"
          placeholder="Enter %"
          formik={formik}
        />
        <TextInput
          label="Hong Kong"
          name="discountHK"
          type="number"
          placeholder="Enter %"
          formik={formik}
        />
        <TextInput
          label="New York"
          name="discountNY"
          type="number"
          placeholder="Enter %"
          formik={formik}
        />
        <TextInput
          label="Belgium"
          name="discountBelgium"
          type="number"
          placeholder="Enter %"
          formik={formik}
        />
      </div>

      {/* Form Buttons */}
      <FormActionButtons
        onPrevious={() => navigate(`/terms${state.partyCode ? `?partyCode=${state.partyCode}` : ''}`)}
        onSaveNext={handleSaveAndNext}
        onSave={formik.handleSubmit}
        onReset={formik.handleReset}
      />
    </form>
  );
}