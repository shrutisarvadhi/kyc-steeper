const CheckboxInput = ({ label, name, formik, required = false }) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      name={name}
      checked={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="h-4 w-4 text-purple-600"
    />
    <label htmlFor={name} className="ml-2 text-sm text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-600 text-xs ml-2">{formik.errors[name]}</div>
    )}
  </div>
);

export default CheckboxInput;
