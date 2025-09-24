import { useNavigate } from 'react-router-dom';

const Account = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <header className="sticky top-0 bg-white flex justify-between items-center px-4 py-2 shadow-md z-50">
      {/* Left: Logo */}
      <img src="ak-logo-black.svg" alt="Logo" className="h-10" />

      {/* Right: Icons + Logout Button */}
      <div className="flex space-x-4 items-center">
        <img src="Frame 131.svg" alt="Notifications" className="h-10 cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors" />
        {isLoggedIn && (<img src="Frame 91.svg" alt="Profile" className="h-10 cursor-pointer hover:bg-gray-100 rounded p-1 transition-colors" />)}

        {/* Logout Button - Only visible if logged in */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Account;