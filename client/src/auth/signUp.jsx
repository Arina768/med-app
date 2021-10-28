import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import InputText from "../elements/inputText/inputText";
import Modal from "../elements/modal/modal";
import { userRegistration } from "../store/actions/userActions";

import { REGISTRATION_FORM_PAGE_LINK } from "../router/routes";

const SignUp = ({ closeModal }) => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const history = useHistory();

  const dispatch = useDispatch();

  const checkCorrectPassword = (value) => {
    if (value !== userPassword) {
      setErrorMessage("The password and confirmation password do not match.");
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
      setErrorMessage("");
    }
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (passwordsMatch) {
      const isLoginSuccessful = await dispatch(
        userRegistration(userName, userPassword, firstName, lastName)
      );
      if (isLoginSuccessful) {
        closeModal();
        history.push(REGISTRATION_FORM_PAGE_LINK);
      } else {
        setErrorMessage("Username already exists");
      }
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <>
        <h4 className="modal__title">Registration</h4>
        <div className="form-wrapper modal__content">
          <div className="error-message">
            {errorMessage && <span>{errorMessage}</span>}
          </div>
          <button type="button" className="close" onClick={closeModal}>
            <span>x</span>
          </button>
          <form>
            <div className="form-group">
              <InputText
                placeholderText="Login"
                inputPayload={(value) => setUserName(value)}
                id="login"
                noAutoComplete
              />
              <InputText
                placeholderText="First Name"
                inputPayload={(value) => setFirstName(value)}
                id="name"
                noAutoComplete
              />
              <InputText
                placeholderText="Last Name"
                inputPayload={(value) => setLastName(value)}
                id="lastName"
                noAutoComplete
              />

              <InputText
                placeholderText="Password"
                inputPayload={(value) => setUserPassword(value)}
                id="password"
                noAutoComplete
                inputType="password"
              />
              <InputText
                placeholderText="Confirm Password"
                inputPayload={(value) => checkCorrectPassword(value)}
                id="password2"
                noAutoComplete
                inputType="password"
              />
            </div>
            <button
              type="submit"
              onClick={handleFormSubmit}
              disabled={!userName || !userPassword || !passwordsMatch}
              className="modal__btn"
            >
              Registration
            </button>
          </form>
        </div>
      </>
    </Modal>
  );
};

export default SignUp;
