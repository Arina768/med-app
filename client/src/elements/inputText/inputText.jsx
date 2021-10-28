import React, { useState } from "react";

import "./styles.scss";

const InputText = ({
  labelText,
  inputPayload,
  id,
  icon,
  inputType,
  placeholderText,
  value,
  errorHandler,
  enterSameValue = false,
  withoutCheck,
  noAutoComplete = false,
  minValue,
  error = "",
}) => {
  const [errorMessage, setErrorMessage] = useState(error);
  const [initialValue, setInintialValue] = useState(value || "");

  const passInputValue = (event) => {
    if (!withoutCheck) {
      const inputValue = event.currentTarget.value;
      if (!inputValue) {
        setErrorMessage("This field is required");
        inputPayload("");
        errorHandler && errorHandler(false);
      } else if (!enterSameValue && inputValue === value) {
        setErrorMessage("You entered the same value");
        errorHandler && errorHandler(false);
      } else {
        const passwordRegExp = new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"
        );
        if (inputType !== "password" || passwordRegExp.test(inputValue)) {
          inputPayload(inputValue.trim());
          setErrorMessage("");
          errorHandler && errorHandler(true);
        } else {
          inputPayload("");
          setErrorMessage(
            "Your password must contain minimum eight characters, at least one upper case and one lower case letter and one number"
          );
          errorHandler && errorHandler(false);
        }
      }
    }
  };

  const controlInputValue = (event) => {
    setInintialValue(event.currentTarget.value);
    if (withoutCheck) {
      inputPayload(event.currentTarget.value);
    }
  };
  return (
    <>
      {icon && <img src={icon} alt="input icon" />}
      <label htmlFor={id} className="col-12 col-md-10 mb-3">
        {labelText}
        <input
          id={id}
          placeholder={placeholderText}
          onBlur={passInputValue}
          type={inputType}
          value={initialValue}
          onChange={controlInputValue}
          className={`form-control ${errorMessage && "is-invalid"}`}
          autoComplete={noAutoComplete ? "new-password" : "on"}
          name={placeholderText}
          min={minValue}
        />
        <div className="error-message d-flex invalid-feedback">
          {(errorMessage || error) && <span>{errorMessage || error}</span>}
        </div>
      </label>
    </>
  );
};

export default InputText;
