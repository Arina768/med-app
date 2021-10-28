import React, { useState } from "react";
import InputText from "../../elements/inputText/inputText";
import { CHANGE_PASSWORD_PATH } from "../../constants";

const UpdatePassword = ({ id }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isValueValid, setIsValueValid] = useState(true);

  const validationRules =
    isValueValid && passwordsMatch && oldPassword && newPassword;

  const сomparePasswords = (value) => {
    if (isValueValid) {
      if (value !== newPassword) {
        setErrorMessage("The password and confirmation password do not match.");
        setPasswordsMatch(false);
      } else {
        setPasswordsMatch(true);
        setErrorMessage("");
      }
    }
  };

  const checkNewPassword = (value) => {
    if (isValueValid) {
      if (value === oldPassword) {
        setErrorMessage("Old Password and new password cannot be same");
      } else {
        setNewPassword(value);
        setErrorMessage("");
      }
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (validationRules) {
      try {
        const data = { _id: id, password: oldPassword, newPassword };
        const req = await fetch(CHANGE_PASSWORD_PATH, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (req.status === 200) {
          setSuccessMessage("Your password has been changed");
          setErrorMessage("");
        } else {
          setErrorMessage("The old password is incorrect");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const inputValidation = (value) => {
    setIsValueValid(value);
    if (!value) {
      setErrorMessage("");
    }
  };

  return (
    <>
      <h3 className="mt-3 mb-4">Update password:</h3>

      <div className="col-12 col-md-6">
        <span className={errorMessage ? "error" : "success"}>
          {errorMessage || successMessage}
        </span>

        <form>
          <div>
            <InputText
              placeholderText="Previous password"
              inputPayload={(value) => setOldPassword(value)}
              id="oldPassword"
              inputType="password"
              errorHandler={(value) => inputValidation(value)}
            />
            <InputText
              placeholderText="New Password"
              inputPayload={(value) => checkNewPassword(value)}
              id="newPassword"
              inputType="password"
              errorHandler={(value) => inputValidation(value)}
            />
            <InputText
              placeholderText="Confirm password"
              inputPayload={(value) => сomparePasswords(value)}
              id="confirmPassword"
              inputType="password"
              errorHandler={(value) => inputValidation(value)}
            />
          </div>
          <button
            type="submit"
            onClick={handleFormSubmit}
            disabled={!validationRules}
            className="btn btn-green w-50"
          >
            Update password
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdatePassword;
