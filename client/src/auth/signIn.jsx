import React, { useState } from "react";
import { useDispatch } from "react-redux";

import InputText from "../elements/inputText/inputText";
import Modal from "../elements/modal/modal";
import { userLogin } from "../store/actions/userActions";

const SignIn = ({ closeModal }) => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const isLoginSuccessful = await dispatch(userLogin(userName, userPassword));
    if (isLoginSuccessful) {
      closeModal();
    } else {
      setErrorMessage("You have entered an invalid username or password");
    }
  };

  return (
    <Modal closeModal={closeModal}>
      <>
        <h4 className="modal__title">Sign in</h4>
        <div className="form-wrapper modal__content">
          <button type="button" className="close" onClick={closeModal}>
            <span>x</span>
          </button>
          <div className="error-message">
            {errorMessage && <span>{errorMessage}</span>}
          </div>
          <form>
            <div className="form-group">
              <InputText
                placeholderText="Email"
                inputPayload={(value) => setUserName(value)}
                id="login"
                withoutCheck
              />
              <InputText
                placeholderText="Password"
                inputPayload={(value) => setUserPassword(value)}
                id="password"
                inputType="password"
                withoutCheck
              />
            </div>
            <button
              type="submit"
              onClick={handleFormSubmit}
              disabled={!userName || !userPassword}
              className="modal__btn"
            >
              Enter
            </button>
          </form>
        </div>
      </>
    </Modal>
  );
};

export default SignIn;
