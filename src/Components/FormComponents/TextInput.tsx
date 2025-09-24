const TextInput = ({ label, name, formik, placeholder, type = "text", required = false, maxLength }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={formik.values[name]}
      placeholder={placeholder}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      maxLength={maxLength}  
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-600 text-xs">{formik.errors[name]}</div>
    )}
  </div>
);
export default TextInput;