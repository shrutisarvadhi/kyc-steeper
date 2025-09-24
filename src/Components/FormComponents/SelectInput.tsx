const SelectInput = ({ label, name, options, formik, required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-600 text-xs">{formik.errors[name]}</div>
    )}
  </div>
);
export default SelectInput;