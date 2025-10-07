import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Account from '../Components/Account';

const LoginPage = () => {
  const navigate = useNavigate();

  // Form validation schema
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 6 characters'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      // Mock authentication: check against admin/admin
      if (values.username === 'admin' && values.password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ username: values.username }));
        navigate('/'); // Redirect to dashboard
      } else {
        formik.setFieldError('password', 'Invalid username or password');
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Account />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="flex flex-col">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter username"
                className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  formik.touched.username && formik.errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-600 text-xs mt-1">{formik.errors.username}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className={`border rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-600 text-xs mt-1">{formik.errors.password}</div>
              )}
              {formik.errors.password && !formik.touched.password && formik.submitCount > 0 && (
                <div className="text-red-600 text-xs mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              {formik.isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            {/* Error Message (global) */}
            {formik.errors.password && formik.submitCount > 0 && !formik.touched.password && (
              <div className="text-red-600 text-center text-sm mt-4">
                Invalid username or password
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;