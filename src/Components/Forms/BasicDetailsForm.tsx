import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { db } from '../../Database/firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FormActionButtons from '../FormComponents/FormActionButton';
import TextInput from '../FormComponents/TextInput';
import SelectInput from '../FormComponents/SelectInput';
import DateInput from '../FormComponents/DateInput';
import TextareaInput from '../FormComponents/TextareaInput';
import CheckboxInput from '../FormComponents/CheckboxInput';
import { usePartyCode } from '../../Contexts/PartyCodeContext';
import { useFormState } from '../../Contexts/FormStateContext';

const containerClass = "bg-white p-6 border border-gray-200 rounded-lg shadow-sm";
const sectionTitleClass = "text-lg font-semibold mb-4";
const gridClass = "grid grid-cols-1 md:grid-cols-4 gap-4";
const gridHalfClass = "grid grid-cols-1 md:grid-cols-2 gap-4";

// Form validation schema using Yup
const validationSchema = Yup.object({
  partyCode: Yup.string().required('Party Code is required'),
  category: Yup.string().required('Category is required'),
  companyIndividual: Yup.string().required('Company/Individual is required'),
  primaryEmail: Yup.string()
    .email('Invalid email')
    .required('Primary email is required')
    .test('email-domain', 'Email domain spam.com is not allowed', (value) => {
      if (!value) return false;
      const domain = value.split('@')[1];
      return domain !== 'spam.com';
    }),
  country: Yup.string().required('Country is required'),

  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Invalid mobile number')
    .notRequired()
    .nullable()
    .test('optional-valid', 'Invalid mobile number', function (value) {
      return !value || /^[0-9]{10}$/.test(value);
    }),

  department: Yup.string().notRequired(),

  phone: Yup.string()
    .nullable()
    .test('valid-phone', 'Invalid phone number', function (value) {
      return !value || /^[0-9]{10}$/.test(value);
    }),

  fax: Yup.string()
    .nullable()
    .test('valid-fax', 'Invalid fax number', function (value) {
      return !value || /^[0-9]{10}$/.test(value);
    }),

  primaryContact: Yup.string()
    .matches(/^[0-9]{10}$/, 'Primary Contact must be exactly 10 digits'),
  secondaryEmail: Yup.string()
    .nullable()
    .test('valid-secondary-email', 'Invalid email', function (value) {
      return !value || Yup.string().email().isValidSync(value);
    }),

  gstNo: Yup.string()
    .nullable()
    .transform((value) => (value ? value.toUpperCase().trim() : value))
    .length(15, 'GST number must be exactly 15 characters formate:22AAAAA0000A1Z5')
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number format'
    ),

  birthDate: Yup.date()
    .nullable()
    .max(new Date(), 'Birth Date cannot be in the future'),
  salesPerson: Yup.string().nullable(),
  assistantSalesPerson: Yup.string().nullable(),
  remark: Yup.string().nullable(),
  registrationDate: Yup.string().nullable(),
  active: Yup.boolean(),
});


export default function BasicDetailsForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useFormState();
  const [searchParams] = useSearchParams();
  const partyCodeFromUrl = searchParams.get('partyCode');
  const [loading, setLoading] = useState(!!partyCodeFromUrl);

  const formik = useFormik({
    initialValues: state.basic || {
      partyCode: partyCodeFromUrl || '',
      category: '',
      companyIndividual: '',
      businessType: '',
      gstNo: '',
      primaryContact: '',
      primaryEmail: '',
      secondaryEmail: '',
      birthDate: '',
      country: '',
      mobile: '',
      phone: '',
      fax: '',
      salesPerson: '',
      assistantSalesPerson: '',
      remark: '',
      registrationDate: '',
      department: '',
      active: false,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      console.log('🚀 ON SUBMIT CALLED!', values);

      try {
        const partyCode = state.isEditing ? partyCodeFromUrl : values.partyCode;
        if (!partyCode) {
          alert('Party Code is required.');
          return;
        }

        // In edit mode, ensure document exists
        if (state.isEditing) {
          const kycDocRef = doc(db, 'kyc', partyCode);
          const docSnap = await getDoc(kycDocRef);
          if (!docSnap.exists()) {
            alert('No existing record found for this Party Code.');
            navigate('/users');
            return;
          }
        } else {
          // Only create parent doc for new records
          const kycDocRef = doc(db, 'kyc', partyCode);
          const docSnap = await getDoc(kycDocRef);
          if (!docSnap.exists()) {
            await setDoc(kycDocRef, { createdAt: new Date() });
          }
        }

        await setDoc(
          doc(db, 'kyc', partyCode, 'BasicDetails', 'BasicDetails'),
          { ...values, partyCode, updatedAt: new Date() },
          { merge: true }
        );

        dispatch({ type: 'SET_BASIC', payload: values });
        dispatch({ type: 'SET_PARTY_CODE', payload: partyCode });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'terms' });
        alert('Basic Details saved successfully!');
      } catch (error) {
        console.error('Error saving form data to Firebase:', error);
        alert('Failed to save Basic Details.');
      }
    },
  });

  const handleSaveAndNext = async () => {
    const errors = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      true
    );

    if (Object.keys(errors).length === 0) {
      try {
        await formik.submitForm();
        navigate(`/terms${partyCodeFromUrl ? `?partyCode=${partyCodeFromUrl}` : ''}`);
      } catch (error) {
        console.error('Error during form submission:', error);
        alert('Failed to save and proceed.');
      }
    } else {
      console.warn('Validation errors:', errors);
    }
  };

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!partyCodeFromUrl) {
        setLoading(false);
        return;
      }

      try {
        const kycDocRef = doc(db, 'kyc', partyCodeFromUrl);
        const docSnap = await getDoc(kycDocRef);
        if (!docSnap.exists()) {
          alert('No existing record found for this Party Code.');
          navigate('/users');
          return;
        }

        const basicSnap = await getDoc(doc(db, 'kyc', partyCodeFromUrl, 'BasicDetails', 'BasicDetails'));
        const basicData = basicSnap.exists() ? basicSnap.data() : {};

        // Initialize all fields to avoid undefined values
        const initializedData = {
          partyCode: basicData.partyCode || partyCodeFromUrl,
          category: basicData.category || '',
          companyIndividual: basicData.companyIndividual || '',
          businessType: basicData.businessType || '',
          gstNo: basicData.gstNo || '',
          primaryContact: basicData.primaryContact || '',
          primaryEmail: basicData.primaryEmail || '',
          secondaryEmail: basicData.secondaryEmail || '',
          birthDate: basicData.birthDate || '',
          country: basicData.country || '',
          mobile: basicData.mobile || '',
          phone: basicData.phone || '',
          fax: basicData.fax || '',
          salesPerson: basicData.salesPerson || '',
          assistantSalesPerson: basicData.assistantSalesPerson || '',
          remark: basicData.remark || '',
          registrationDate: basicData.registrationDate || '',
          department: basicData.department || '',
          active: basicData.active || false,
        };

        dispatch({ type: 'SET_BASIC', payload: initializedData });
        dispatch({ type: 'SET_PARTY_CODE', payload: partyCodeFromUrl });
        dispatch({ type: 'SET_IS_EDITING', payload: true });
        dispatch({ type: 'SET_CURRENT_STEP', payload: 'basic' });
        setLoading(false);
      } catch (error) {
        console.error('Error loading Basic Details:', error);
        alert('Failed to load Basic Details.');
        setLoading(false);
      }
    };

    fetchExistingData();
  }, [partyCodeFromUrl, dispatch, navigate]);

  if (loading) {
    return <div className="p-6 text-center">Loading Basic Details...</div>;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={containerClass}>
        {/* Category Details Section */}
        <div className="mb-6">
          <h3 className={sectionTitleClass}>Category Details</h3>
          <div className={gridClass}>
            <TextInput
              label="Party Code"
              name="partyCode"
              type="text"
              formik={formik}
              required
            />

            <SelectInput
              label="Category"
              name="category"
              options={['Individual', 'Company']}
              formik={formik}
              required
            />

            <TextInput
              label="Company/Individual"
              name="companyIndividual"
              type="text"
              formik={formik}
              required
            />

            <SelectInput
              label="Business Type"
              name="businessType"
              options={['Proprietorship', 'Limited Company']}
              formik={formik}
            />

            <TextInput
              label="GST No"
              name="gstNo"
              type="text"
              maxLength={15}
              formik={{
                ...formik,
                handleChange: (e) => {
                  const { name, value } = e.target;
                  formik.setFieldValue(name, value.toUpperCase());
                  if (value.length <= 15) {
                    formik.setFieldValue(name, value.toUpperCase());
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="mb-6">
          <h3 className={sectionTitleClass}>Contact Details</h3>
          <div className={gridClass}>
            <TextInput
              label="Primary Contact"
              name="primaryContact"
              type="tel"
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
              label="Primary Email"
              name="primaryEmail"
              type="email"
              formik={formik}
              required
            />

            <TextInput
              label="Secondary Email"
              name="secondaryEmail"
              type="email"
              formik={formik}
            />

            <DateInput
              label="Birth Date"
              name="birthDate"
              formik={formik}
            />
          </div>

          {/* Country, Mobile, Phone, Fax */}
          <div className={`${gridClass} mt-4`}>
            <SelectInput
              label="Country"
              name="country"
              options={['India', 'USA']}
              formik={formik}
              required
            />

            <TextInput
              label="Mobile No."
              name="mobile"
              type="tel"
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
              label="Phone No."
              name="phone"
              type="tel"
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
              label="Fax No."
              name="fax"
              type="tel"
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
          </div>
        </div>

        {/* Other Details Section */}
        <div className="mb-6">
          <h3 className={sectionTitleClass}>Other Details</h3>
          <div className={gridHalfClass}>
            <SelectInput
              label="Sales Person/Employee"
              name="salesPerson"
              options={['Amit', 'Rahul']}
              formik={formik}
            />

            <SelectInput
              label="Assistant Sales Person"
              name="assistantSalesPerson"
              options={['Sunil', 'Vikas']}
              formik={formik}
            />

            <TextareaInput
              label="Remark"
              name="remark"
              formik={formik}
            />

            <DateInput
              label="Registration Date"
              name="registrationDate"
              formik={formik}
            />

            <SelectInput
              label="Department"
              name="department"
              options={['Sales', 'Support']}
              formik={formik}
            />
          </div>
        </div>

        {/* Active Checkbox */}
        <CheckboxInput
          label="Active (Please check the box if the user should be marked as Active.)"
          name="active"
          formik={formik}
        />

        {/* Submit Buttons */}
        <FormActionButtons
          onSave={formik.handleSubmit}
          onSaveNext={handleSaveAndNext}
          onReset={formik.handleReset}
          onClose={() => console.log('Close clicked')}  
          showPrevious={false}
          showClose={true}
          closeLabel="Close"
        />
      </div>
    </form>
  );
}