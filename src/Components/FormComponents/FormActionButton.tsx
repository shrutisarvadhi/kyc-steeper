// src/Components/Forms/FormActionButtons.jsx
import React from 'react';

const FormActionButtons = ({
  onPrevious,
  onSaveNext,
  onSave,
  onReset,
  onClose,
  showPrevious = true,
  showSaveNext = true,
  showSave = true,
  showReset = true,
  showClose = false,
  previousLabel = "Previous",
  saveNextLabel = "Save & Next",
  saveLabel = "Save",
  resetLabel = "Reset",
  closeLabel = "Close",
  saveNextDisabled = false,
  saveDisabled = false,
  resetDisabled = false,
  closeDisabled = false,
}) => {
  const buttonBaseClass = "px-4 py-2 rounded-md transition";
  const buttonPreviousClass = `${buttonBaseClass} bg-gray-300 text-gray-800 hover:bg-gray-400`;
  const buttonSaveNextClass = `${buttonBaseClass} bg-purple-600 text-white hover:bg-purple-700`;
  const buttonSaveClass = `${buttonBaseClass} bg-gray-300 text-gray-800 hover:bg-gray-400`;
  const buttonResetClass = `${buttonBaseClass} bg-gray-500 text-white hover:bg-gray-600`;
  const buttonCloseClass = `${buttonBaseClass} bg-gray-200 text-gray-800 hover:bg-gray-300`;

  return (
    <div className="flex justify-end space-x-4 mt-6">
      {showPrevious && (
        <button
          type="button"
          className={buttonPreviousClass}
          onClick={onPrevious}
        >
          {previousLabel}
        </button>
      )}
      {showSaveNext && (
        <button
          type="button"
          className={buttonSaveNextClass}
          onClick={onSaveNext}
          disabled={saveNextDisabled}
        >
          {saveNextLabel}
        </button>
      )}
      {showSave && (
        <button
          type="submit" // ✅ make it a proper submit button
          className={buttonSaveClass}
          disabled={saveDisabled}
        >
          {saveLabel}
        </button>
      )}
      {showReset && (
        <button
          type="button"
          className={buttonResetClass}
          onClick={onReset}
          disabled={resetDisabled}
        >
          {resetLabel}
        </button>
      )}
      {showClose && (
        <button
          type="button"
          className={buttonCloseClass}
          onClick={onClose}
          disabled={closeDisabled}
        >
          {closeLabel}
        </button>
      )}
    </div>
  );
};

export default FormActionButtons;
