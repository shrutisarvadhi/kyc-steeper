const TextareaInput = ({ label, name, formik, rows = 3, required = false }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      rows={rows}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
    />
    {formik.touched[name] && formik.errors[name] && (
      <div className="text-red-600 text-xs">{formik.errors[name]}</div>
    )}
  </div>
);

export default TextareaInput;
