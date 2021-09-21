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
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [initialValue, setInintialValue] = useState(value || "");

  const passInputValue = (event) => {
    const inputValue = event.currentTarget.value;
    if (!inputValue) {
      setErrorMessage("This field is required");
      inputPayload("");
      errorHandler && errorHandler(false);
    } else if (!enterSameValue && inputValue === value) {
      setErrorMessage("You entered the same value");
      errorHandler && errorHandler(false);
    } else {
      const passwordRegExp = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
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
  };

  const controlInputValue = (event) => {
    setInintialValue(event.currentTarget.value);
  };
  return (
    <>
      <div className="input-container">
        {icon && <img src={icon} alt="input icon" />}
        <label htmlFor={id}>
          {labelText}
          <input
            id={id}
            placeholder={placeholderText}
            onBlur={passInputValue}
            type={inputType}
            value={initialValue}
            onChange={controlInputValue}
            className={errorMessage && "error"}
          />
        </label>
      </div>
      <div className="error-message">{errorMessage && <span>{errorMessage}</span>}</div>
    </>
  );
};

export default InputText;
