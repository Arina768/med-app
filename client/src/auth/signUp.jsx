import React, { useState, MouseEvent } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { userRegistration } from "@/store/actions";

import InputText from "../elements/inputText/inputTest";
import Modal from "../elements/modal/modal";

// import { PROFILE_PAGE_LINK } from "../../../router/routes";

const SignUp = ({ closeModal }) => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

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
    // if (passwordsMatch) {
    //   const isLoginSuccessful = ((await dispatch(
    //     userRegistration(userName, userPassword, firstName, lastName, role)
    //   )) as unknown) as boolean;
    //   if (isLoginSuccessful) {
    //     closeModal();
    //     history.push(PROFILE_PAGE_LINK);
    //   } else {
    //     setErrorMessage("Username already exists");
    //   }
    // }
  };

  return (
    <Modal closeModal={closeModal}>
      <div className="form-wrapper">
        <h4>Registration</h4>
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
              // icon={userIcon}
            />
            <InputText
              placeholderText="First Name"
              inputPayload={(value) => setFirstName(value)}
              id="login"
              // icon={userIcon}
            />
            <InputText
              placeholderText="Last Name"
              inputPayload={(value) => setLastName(value)}
              id="login"
              // icon={userIcon}
            />
            <div className="input-container">
              <label htmlFor="role-select" className="select">
                Role
                <select
                  id="role-select"
                  onChange={(e) => setRole(e.currentTarget.value)}
                >
                  <option value={"buyer"}>Buyer</option>
                  <option value={"admin"}>Admin</option>
                </select>
              </label>
            </div>
            <InputText
              placeholderText="Password"
              inputPayload={(value) => setUserPassword(value)}
              id="password"
              // icon={passwordIcon}
              inputType="password"
            />
            <InputText
              placeholderText="Confirm Password"
              inputPayload={(value) => checkCorrectPassword(value)}
              id="password2"
              // icon={passwordIcon}
              inputType="password"
            />
          </div>
          <button
            type="submit"
            onClick={handleFormSubmit}
            disabled={!userName || !userPassword || !passwordsMatch}
          >
            Registration
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default SignUp;
