import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from "../Database/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setCurrentStep, setIsEditing } from '../store/slices/kycSlice';
import { setAddressDetails } from '../store/slices/addressDetailsSlice';
import SelectInput from '../Components/FormComponents/SelectInput';
import TextInput from '../Components/FormComponents/TextInput';
import CheckboxInput from '../Components/FormComponents/CheckboxInput';
import FormActionButtons from '../Components/FormComponents/FormActionButton';

// --- Tailwind class strings ---
const containerClass = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";
const titleClass = "text-xl font-semibold mb-4";
const grid5Class = "grid grid-cols-1 md:grid-cols-5 gap-4 mb-6";

// --- Validation Schema ---
const validationSchema = Yup.object({
  addressType: Yup.string().required("Type is required"),
  country: Yup.string().required("Country is required"),
  city: Yup.string().required("City is required"),
  companyName: Yup.string(),
  contactNo: Yup.string()
    .nullable()
    .matches(/^[0-9]{10}$/, 'Contact must be exactly 10 digits'),
  unit: Yup.string(),
  building: Yup.string(),
  street: Yup.string(),
  landmark: Yup.string(),
  area: Yup.string(),
  state: Yup.string(),
  zipCode: Yup.string()
    .nullable()
    .test('valid-zip', 'Zip Code must be numeric', value =>
      !value || /^[0-9]{4,10}$/.test(value)
    ),
  defaultAddress: Yup.boolean(),
});

export default function AddressDetailsForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const addressDetails = useSelector((state: RootState) => state.addressDetails);
  const { partyCode, isEditing } = useSelector((state: RootState) => state.kyc);
  const [searchParams] = useSearchParams();
  const partyCodeFromUrl = searchParams.get('partyCode');
  const [loading, setLoading] = useState(!!partyCodeFromUrl);

  const formik = useFormik({
    initialValues: addressDetails || {
      addressType: '',
      companyName: '',
      contactNo: '',
      unit: '',
      building: '',
      street: '',
      landmark: '',
      area: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      defaultAddress: false,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('✅ Address Submitted:', values);

      const effectivePartyCode = partyCode || partyCodeFromUrl;
      if (!effectivePartyCode) {
        alert('No Party Code found! Please go back and fill in Basic Details.');
        navigate('/');
        return;
      }

      try {
        const addressDetailsRef = doc(db, 'kyc', effectivePartyCode, 'AddressDetails', 'AddressDetails');
        await setDoc(addressDetailsRef, { ...values, updatedAt: new Date() }, { merge: true });

        dispatch(setAddressDetails(values));
        dispatch(setCurrentStep('users'));
        dispatch(setIsEditing(false));
        alert('Address Details saved successfully!');
      } catch (error) {
        console.error('Error saving AddressDetails to Firebase:', error);
        alert('Failed to save Address Details.');
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
        navigate(`/users${partyCode ? `?partyCode=${partyCode}` : ''}`);
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
      if (!partyCodeFromUrl || !isEditing) {
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

        const addressSnap = await getDoc(doc(db, 'kyc', partyCodeFromUrl, 'AddressDetails', 'AddressDetails'));
        const addressData = addressSnap.exists() ? addressSnap.data() : {};

        const initializedData = {
          addressType: addressData.addressType || '',
          companyName: addressData.companyName || '',
          contactNo: addressData.contactNo || '',
          unit: addressData.unit || '',
          building: addressData.building || '',
          street: addressData.street || '',
          landmark: addressData.landmark || '',
          area: addressData.area || '',
          country: addressData.country || '',
          state: addressData.state || '',
          city: addressData.city || '',
          zipCode: addressData.zipCode || '',
          defaultAddress: addressData.defaultAddress || false,
        };

        dispatch(setAddressDetails(initializedData));
        setLoading(false);
      } catch (error) {
        console.error('Error loading Address Details:', error);
        alert('Failed to load Address Details.');
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [partyCodeFromUrl, isEditing, dispatch, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Loading Address Details...</div>;
  }

  return (
    <form onSubmit={formik.handleSubmit} className={containerClass}>
      <h2 className={titleClass}>Address Details</h2>

      {/* First Row: 5 columns */}
      <div className={grid5Class}>
        <SelectInput
          label="Type"
          name="addressType"
          options={['Office', 'Residential']}
          formik={formik}
          required
        />
        <TextInput
          label="Company Name"
          name="companyName"
          placeholder="Enter Company Name"
          formik={formik}
        />
        <TextInput
          label="Contact No."
          name="contactNo"
          type="tel"
          placeholder="Enter Contact No."
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
        <TextInput
          label="Unit"
          name="unit"
          placeholder="Enter Unit"
          formik={formik}
        />
        <TextInput
          label="Building"
          name="building"
          placeholder="Enter Building"
          formik={formik}
        />
      </div>

      {/* Second Row: 5 columns */}
      <div className={grid5Class}>
        <TextInput
          label="Street"
          name="street"
          placeholder="Enter Street"
          formik={formik}
        />
        <TextInput
          label="Landmark"
          name="landmark"
          placeholder="Enter Landmark"
          formik={formik}
        />
        <TextInput
          label="Area"
          name="area"
          placeholder="Enter Area"
          formik={formik}
        />
        <SelectInput
          label="Country"
          name="country"
          options={['India', 'USA']}
          formik={formik}
          required
        />
        <SelectInput
          label="State"
          name="state"
          options={['Maharashtra', 'Tamil Nadu']}
          formik={formik}
        />
      </div>

      {/* Third Row: 5 columns */}
      <div className={grid5Class}>
        <SelectInput
          label="City"
          name="city"
          options={['Mumbai', 'Chennai']}
          formik={formik}
          required
        />
        <TextInput
          label="Zip Code"
          name="zipCode"
          placeholder="Enter Zip Code"
          formik={formik}
        />
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Default Address Checkbox */}
      <CheckboxInput
        label="Please check the box if the Address should be marked as Default."
        name="defaultAddress"
        formik={formik}
      />

      {/* Action Buttons */}
      <FormActionButtons
        onPrevious={() => navigate(`/user${partyCode ? `?partyCode=${partyCode}` : ''}`)}
        onSaveNext={handleSaveAndNext}
        onSave={formik.handleSubmit}
        onReset={formik.handleReset}
      />
    </form>
  );
}