import React, { useEffect } from 'react';
import { db } from '../Database/firebase';
import { collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setIsEditing, setCurrentStep, setPartyCode, resetAll } from '../store/slices/kycSlice';
import { setUsers, setLoading, deleteUser } from '../store/slices/userListSlice';

const UserListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.userList);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setLoading(true));
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
              createdAt: basicData.createdAt ? basicData.createdAt.toDate().toISOString() : '-', // Convert Timestamp to ISO string
              updatedAt: basicData.updatedAt ? basicData.updatedAt.toDate().toISOString() : '-', // Convert Timestamp to ISO string
            };
          })
        );

        dispatch(setUsers(usersData));
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users. Please try again.');
        dispatch(setLoading(false));
      } finally {
        dispatch(resetAll());
      }
    };

    fetchUsers();
  }, [dispatch]);

  const handleEdit = (id: string) => {
    dispatch(setIsEditing(true));
    dispatch(setCurrentStep('basic'));
    dispatch(setPartyCode(id));
    navigate(`/?partyCode=${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? This deletes the entire KYC record.')) return;

    try {
      const kycRef = doc(db, 'kyc', id);
      const subcollections = ['BasicDetails', 'TermsDetails', 'UserDetails', 'AddressDetails'];

      await Promise.all(
        subcollections.map(async (subcollection) => {
          const subcollectionRef = collection(db, 'kyc', id, subcollection);
          const snapshot = await getDocs(subcollectionRef);
          await Promise.all(snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref)));
        })
      );

      await deleteDoc(kycRef);
      dispatch(deleteUser(id));
      alert('KYC record deleted successfully!');
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete. Check console.');
    }
  };

  const exportToExcel = () => {
    const exportData = users.map(({ id, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KYC Users');
    XLSX.writeFile(workbook, `kyc_users_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading KYC records...</div>;
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-xl font-bold mb-6">KYC User List</h2>

      <button
        onClick={exportToExcel}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Export to Excel
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border">Party Code</th>
              <th className="py-3 px-4 border">Company/Individual</th>
              <th className="py-3 px-4 border">Email</th>
              <th className="py-3 px-4 border">Mobile</th>
              <th className="py-3 px-4 border">Address Type</th>
              <th className="py-3 px-4 border">Contact No.</th>
              <th className="py-3 px-4 border">Street</th>
              <th className="py-3 px-4 border">City</th>
              <th className="py-3 px-4 border">State</th>
              <th className="py-3 px-4 border">Country</th>
              <th className="py-3 px-4 border">Zip Code</th>
              <th className="py-3 px-4 border">Default Address</th>
              <th className="py-3 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.partyCode}</td>
                <td className="py-3 px-4">{user.companyIndividual}</td>
                <td className="py-3 px-4">{user.primaryEmail}</td>
                <td className="py-3 px-4">{user.mobile}</td>
                <td className="py-3 px-4">{user.addressType}</td>
                <td className="py-3 px-4">{user.contactNo}</td>
                <td className="py-3 px-4">{user.street}</td>
                <td className="py-3 px-4">{user.city}</td>
                <td className="py-3 px-4">{user.state}</td>
                <td className="py-3 px-4">{user.country}</td>
                <td className="py-3 px-4">{user.zipCode}</td>
                <td className="py-3 px-4">
                  {user.defaultAddress ? (
                    <span className="inline-block w-4 h-4 bg-green-600 rounded-full" title="Default"></span>
                  ) : (
                    <span className="inline-block w-4 h-4 bg-gray-300 rounded-full" title="Not Default"></span>
                  )}
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <button onClick={() => handleEdit(user.id)} className="text-blue-600 hover:text-blue-800" title="Edit">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800" title="Delete">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <p className="text-gray-500 text-center mt-4">No KYC records found. Add one to get started!</p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            dispatch(resetAll());
            navigate('/');
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add New KYC
        </button>
      </div>
    </div>
  );
};

export default UserListPage;