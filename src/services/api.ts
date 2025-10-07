import { db } from '../Database/firebase';
import { doc, setDoc, getDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

// Interfaces for form data
interface BasicDetails {
  partyCode: string;
  category: string;
  companyIndividual: string;
  businessType: string;
  gstNo: string;
  primaryContact: string;
  primaryEmail: string;
  secondaryEmail: string;
  birthDate: string;
  country: string;
  mobile: string;
  phone: string;
  fax: string;
  salesPerson: string;
  assistantSalesPerson: string;
  remark: string;
  registrationDate: string;
  department: string;
  active: boolean;
  createdAt?: string; // Add as string
  updatedAt?: string; // Add as string
}

interface TermsDetails {
  currency: string;
  dayTerms: string;
  termName: string;
  extPercent: string;
  rapPercent: string;
  extraDollar: string;
  creditLimit: string;
  memoLimit: string;
  default: boolean;
  aadatParty1: string;
  aadatComm1: string;
  broker1: string;
  brokerComm1: string;
  updatedAt?: string; // Add as string
}

interface UserDetails {
  terms: string;
  role: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  location: string;
  apiUser: boolean;
  discountMumbai: string;
  discountHK: string;
  discountNY: string;
  discountBelgium: string;
  updatedAt?: string; // Add as string
}

interface AddressDetails {
  addressType: string;
  companyName: string;
  contactNo: string;
  unit: string;
  building: string;
  street: string;
  landmark: string;
  area: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  defaultAddress: boolean;
  updatedAt?: string; // Add as string
}

interface UserListItem {
  id: string;
  partyCode: string;
  companyIndividual: string;
  primaryEmail: string;
  mobile: string;
  currency: string;
  dayTerms: string;
  username: string;
  email: string;
  role: string;
  addressType: string;
  contactNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  defaultAddress: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Functions
export const getFormData = async <T>(partyCode: string, collectionName: string): Promise<T | null> => {
  try {
    const docRef = doc(db, 'kyc', partyCode);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error('No KYC record found for this Party Code.');
    }

    const formSnap = await getDoc(doc(db, 'kyc', partyCode, collectionName, collectionName));
    if (!formSnap.exists()) return null;

    const data = formSnap.data();
    // Convert Timestamp to ISO strings
    return {
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
    } as T;
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    throw error;
  }
};

function removeUndefinedFields(obj: Record<string, any>): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

export const saveFormData = async <T>(partyCode: string, collectionName: string, data: T): Promise<void> => {
  try {
    const kycDocRef = doc(db, 'kyc', partyCode);
    const docSnap = await getDoc(kycDocRef);
    if (!docSnap.exists()) {
      await setDoc(kycDocRef, { createdAt: new Date() });
    }

    const cleanedData = removeUndefinedFields({
      ...data,
      updatedAt: new Date(),
    });

    const formDocRef = doc(db, 'kyc', partyCode, collectionName, collectionName);
    await setDoc(formDocRef, cleanedData, { merge: true });
  } catch (error) {
    console.error(`Error saving ${collectionName}:`, error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<UserListItem[]> => {
  try {
    const kycSnapshot = await getDocs(collection(db, 'kyc'));
    const usersData = await Promise.all(
      kycSnapshot.docs.map(async (docSnap) => {
        const partyCode = docSnap.id;
        const [basic, terms, user, address] = await Promise.all([
          getDoc(doc(db, 'kyc', partyCode, 'BasicDetails', 'BasicDetails')),
          getDoc(doc(db, 'kyc', partyCode, 'TermsDetails', 'TermsDetails')),
          getDoc(doc(db, 'kyc', partyCode, 'UserDetails', 'UserDetails')),
          getDoc(doc(db, 'kyc', partyCode, 'AddressDetails', 'AddressDetails')),
        ]);

        const basicData = basic.data() || {};
        const termsData = terms.data() || {};
        const userData = user.data() || {};
        const addressData = address.data() || {};

        return {
          id: partyCode,
          partyCode,
          companyIndividual: basicData.companyIndividual || '-',
          primaryEmail: basicData.primaryEmail || '-',
          mobile: basicData.mobile || '-',
          currency: termsData.currency || '-',
          dayTerms: termsData.dayTerms || '-',
          username: userData.username || '-',
          email: userData.email || '-',
          role: userData.role || '-',
          addressType: addressData.addressType || '-',
          contactNo: addressData.contactNo || '-',
          street: addressData.street || '-',
          city: addressData.city || '-',
          state: addressData.state || '-',
          country: addressData.country || '-',
          zipCode: addressData.zipCode || '-',
          defaultAddress: addressData.defaultAddress || false,
          createdAt: basicData.createdAt instanceof Timestamp ? basicData.createdAt.toDate().toISOString() : basicData.createdAt || '-',
          updatedAt: basicData.updatedAt instanceof Timestamp ? basicData.updatedAt.toDate().toISOString() : basicData.updatedAt || '-',
        };
      })
    );
    return usersData;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteKycRecord = async (partyCode: string): Promise<void> => {
  try {
    const kycRef = doc(db, 'kyc', partyCode);
    const subcollections = ['BasicDetails', 'TermsDetails', 'UserDetails', 'AddressDetails'];

    await Promise.all(
      subcollections.map(async (subcollection) => {
        const subcollectionRef = collection(db, 'kyc', partyCode, subcollection);
        const snapshot = await getDocs(subcollectionRef);
        await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)));
      })
    );

    await deleteDoc(kycRef);
  } catch (error) {
    console.error('Error deleting KYC record:', error);
    throw error;
  }
};