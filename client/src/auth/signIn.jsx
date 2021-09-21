import React, { useState, MouseEvent } from "react";
import { useDispatch } from "react-redux";

import InputText from "@/elements/inputText";
import Modal from "@/elements/modal";
// import { userLogin } from "@/store/actions";



const SignIn = ({ closeModal }) => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // const isLoginSuccessful = ((await dispatch(userLogin(userName, userPassword))) as unknown) as boolean;
    // if (isLoginSuccessful) {
    //   closeModal();
    // } else {
    //   setErrorMessage("You have entered an invalid username or password");
    // }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="form-wrapper">
        <h4>Sign in</h4>
        <button type="button" className="close" onClick={closeModal}>
          <span>x</span>
        </button>
        <div className="error-message">{errorMessage && <span>{errorMessage}</span>}</div>
        <form>
          <div className="form-group">
            <InputText
              placeholderText="Login"
              inputPayload={(value) => setUserName(value)}
              id="login"
              // icon={userIcon}
            />
            <InputText
              placeholderText="Password"
              inputPayload={(value) => setUserPassword(value)}
              id="password"
              // icon={passwordIcon}
            />
          </div>
          <button type="submit" onClick={handleFormSubmit} disabled={!userName || !userPassword}>
            Enter
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default SignIn;
