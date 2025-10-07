import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../Database/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setCurrentStep } from '../store/slices/kycSlice';
import { setTermsDetails } from '../store/slices/termsDetailsSlice';
import SelectInput from "../Components/FormComponents/SelectInput";
import TextInput from "../Components/FormComponents/TextInput";
import CheckboxInput from "../Components/FormComponents/CheckboxInput";
import FormActionButtons from "../Components/FormComponents/FormActionButton";

// --- Tailwind class strings ---
const containerClass = "bg-white p-6 rounded-lg shadow-sm border border-gray-200";
const titleClass = "text-xl font-semibold mb-4";
const subtitleClass = "text-lg font-medium mb-4";
const deleteButtonClass = "ml-2 text-red-500";
const grid3Class = "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6";
const grid5Class = "grid grid-cols-1 md:grid-cols-5 gap-4 mb-6";
const grid2Class = "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6";

// --- Yup Validation Schema ---
const optionalNumber = (label) =>
  Yup.string()
    .nullable()
    .test(`valid-${label}`, `${label} must be a positive number`, (value) => {
      return !value || /^[0-9.]+$/.test(value);
    });

const validationSchema = Yup.object({
  currency: Yup.string().required("Currency is required"),
  dayTerms: Yup.string().required("Day Terms is required"),
  termName: Yup.string()
    .max(50, "Term Name must be at most 50 characters")
    .nullable(),
  extPercent: Yup.string()
    .nullable()
    .test("is-decimal", "Ext % must be a positive number", value =>
      !value || /^[0-9]*\.?[0-9]+$/.test(value)
    ),
  rapPercent: Yup.string()
    .nullable()
    .test("is-decimal", "Rap % must be a positive number", value =>
      !value || /^[0-9]*\.?[0-9]+$/.test(value)
    ),
  extraDollar: Yup.string()
    .nullable()
    .test("is-decimal", "Extra $ must be a positive number", value =>
      !value || /^[0-9]*\.?[0-9]+$/.test(value)
    ),
  creditLimit: Yup.string()
    .nullable()
    .test("is-decimal", "Credit Limit must be a positive number", value =>
      !value || /^[0-9]*\.?[0-9]+$/.test(value)
    ),
  memoLimit: Yup.string()
    .nullable()
    .test("is-decimal", "Memo Limit must be a positive number", value =>
      !value || /^[0-9]*\.?[0-9]+$/.test(value)
    ),
  default: Yup.boolean(),

  aadatParty1: Yup.string(),
  aadatComm1: optionalNumber("Aadat Comm"),

  broker1: Yup.string(),
  brokerComm1: optionalNumber("Broker Comm"),
});

export default function TermsDetailsForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const termsDetails = useSelector((state: RootState) => state.termsDetails);
  const { partyCode, isEditing } = useSelector((state: RootState) => state.kyc);
  const [searchParams] = useSearchParams();
  const partyCodeFromUrl = searchParams.get('partyCode');
  const [loading, setLoading] = useState(!!partyCodeFromUrl);

  const formik = useFormik({
    initialValues: termsDetails || {
      currency: '',
      dayTerms: '',
      termName: '',
      extPercent: '',
      rapPercent: '',
      extraDollar: '',
      creditLimit: '',
      memoLimit: '',
      default: false,
      aadatParty1: '',
      aadatComm1: '',
      broker1: '',
      brokerComm1: '',
    },
    validationSchema,
    enableReinitialize: true, 
    onSubmit: async (values) => {
      console.log('✅ Submitted Values:', values);

      const effectivePartyCode = partyCode || partyCodeFromUrl;
      if (!effectivePartyCode) {
        alert('No Party Code found! Please go back and fill in Basic Details.');
        navigate('/');
        return;
      }

      try {
        const termsDetailsRef = doc(db, 'kyc', effectivePartyCode, 'TermsDetails', 'TermsDetails');
        await setDoc(termsDetailsRef, { ...values, updatedAt: new Date() }, { merge: true });

        dispatch(setTermsDetails(values));
        dispatch(setCurrentStep('user'));
        alert('Terms Details saved successfully!');
      } catch (error) {
        console.error('Error saving TermsDetails to Firebase:', error);
        alert('Failed to save Terms Details.');
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
        navigate(`/user${partyCode ? `?partyCode=${partyCode}` : ''}`);
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
        // Verify parent document exists
        const kycDocRef = doc(db, 'kyc', partyCodeFromUrl);
        const kycDocSnap = await getDoc(kycDocRef);
        if (!kycDocSnap.exists()) {
          alert('No KYC record found for this Party Code.');
          navigate('/users');
          return;
        }

        const termsSnap = await getDoc(doc(db, 'kyc', partyCodeFromUrl, 'TermsDetails', 'TermsDetails'));
        const termsData = termsSnap.exists() ? termsSnap.data() : {};

        const initializedData = {
          currency: termsData.currency || '',
          dayTerms: termsData.dayTerms || '',
          termName: termsData.termName || '',
          extPercent: termsData.extPercent || '',
          rapPercent: termsData.rapPercent || '',
          extraDollar: termsData.extraDollar || '',
          creditLimit: termsData.creditLimit || '',
          memoLimit: termsData.memoLimit || '',
          default: termsData.default || false,
          aadatParty1: termsData.aadatParty1 || '',
          aadatComm1: termsData.aadatComm1 || '',
          broker1: termsData.broker1 || '',
          brokerComm1: termsData.brokerComm1 || '',
        };

        dispatch(setTermsDetails(initializedData));
        setLoading(false);
      } catch (error) {
        console.error('Error loading Terms Details:', error);
        alert('Failed to load Terms Details.');
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [partyCodeFromUrl, isEditing, dispatch, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Loading Terms Details...</div>;
  }

  return (
    <form onSubmit={formik.handleSubmit} className={containerClass}>
      <h2 className={titleClass}>Terms Details</h2>

      {/* First Row */}
      <div className={grid3Class}>
        <SelectInput
          label="Currency (%)"
          name="currency"
          options={["INR", "USD", "EUR"]}
          formik={formik}
          required
        />
        <SelectInput
          label="Day Terms (0)"
          name="dayTerms"
          options={["7 Days", "15 Days", "30 Days"]}
          formik={formik}
          required
        />
        <TextInput
          label="Term Name"
          name="termName"
          placeholder="Enter Term Name"
          type="text"
          formik={formik}
        />
      </div>

      {/* Second Row */}
      <div className={grid5Class}>
        <TextInput
          label="Ext %"
          name="extPercent"
          placeholder="Enter Ext %"
          type="number"
          formik={formik}
        />
        <TextInput
          label="Rap %"
          name="rapPercent"
          placeholder="Enter Rap %"
          type="number"
          formik={formik}
        />
        <TextInput
          label="Extra $"
          name="extraDollar"
          placeholder="0.00"
          type="number"
          formik={formik}
        />
        <TextInput
          label="Credit Limit"
          name="creditLimit"
          placeholder="Enter Credit Limit"
          type="number"
          formik={formik}
        />
        <TextInput
          label="Memo Limit"
          name="memoLimit"
          placeholder="Enter Memo Limit"
          type="number"
          formik={formik}
        />
      </div>

      {/* Default Checkbox */}
      <CheckboxInput
        label="Default (Please check the box if the terms should be marked as Default.)"
        name="default"
        formik={formik}
      />

      {/* Aadat & Broker Section */}
      <br />
      <h3 className={subtitleClass}>Aadat & Broker Details</h3>
      <div className={grid2Class}>
        {/* Aadat Party 1 */}
        <SelectInput
          label="Aadat Party 1"
          name="aadatParty1"
          options={["Party A", "Party B"]}
          formik={formik}
        />
        <div className="flex items-end">
          <TextInput
            label="Comm"
            name="aadatComm1"
            type="number"
            placeholder="00"
            formik={formik}
          />
          <button type="button" className={deleteButtonClass}>❌</button>
        </div>

        {/* Broker 1 */}
        <SelectInput
          label="Broker 1"
          name="broker1"
          options={["Broker A", "Broker B"]}
          formik={formik}
        />
        <div className="flex items-end">
          <TextInput
            label="Comm"
            name="brokerComm1"
            type="number"
            placeholder="00"
            formik={formik}
          />
          <button type="button" className={deleteButtonClass}>❌</button>
        </div>
      </div>

      {/* Buttons */}
      <FormActionButtons
        onPrevious={() => navigate(`/${partyCode ? `?partyCode=${partyCode}` : ''}`)}
        onSaveNext={handleSaveAndNext}
        onSave={formik.handleSubmit}
        onReset={formik.handleReset}
      />
    </form>
  );
}