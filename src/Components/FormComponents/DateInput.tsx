const DateInput = ({ label, name, formik, required = false }) => {
  // If it's the birthDate field, set max to today
  const isBirthDate = name === 'birthDate';
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="date"
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        max={isBirthDate ? today : undefined} // 👈 only set max for birthDate
        className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-600 text-xs">{formik.errors[name]}</div>
      )}
    </div>
  );
};

export default DateInput;
