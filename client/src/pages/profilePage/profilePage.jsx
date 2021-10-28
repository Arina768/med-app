import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  changeUserInfo,
  getUserInfo,
  loginAction,
} from "../../store/actions/userActions";
import { HOME_PAGE_LINK, SETTINGS_PAGE_LINK } from "../../router/routes";
import InputText from "../../elements/inputText/inputText";

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isValueValid, setIsValueValid] = useState(false);

  const id = localStorage.getItem("id");
  const userName = useSelector((appState) => appState.firstName);
  const userEmail = useSelector((appState) => appState.email);

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    const userInfo = {
      _id: id,
      email: userEmail,
      firstName: userName,
    };
    setUserInfo(userInfo);
  }, [id, userEmail, userName]);
  useEffect(() => {
    if ((!userName || !userEmail) && id) {
      dispatch(getUserInfo(id));
    }
  }, [dispatch, id, userEmail, userName]);

  const changeUserData = async () => {
    const isDataChanged = await dispatch(changeUserInfo(userInfo));
    if (!isDataChanged) {
      setErrorMessage("Email already exists");
    } else {
      setSuccessMessage("The information was updated successfully.");
      setErrorMessage("");
    }
  };

  const signOut = () => {
    history.push(HOME_PAGE_LINK);
    dispatch(loginAction("", "", "", ""));
  };

  const inputValidation = (value) => {
    setIsValueValid(value);
    setErrorMessage("");
  };
  return id && userName ? (
    <div className="profile-page container">
      <h1 className="border-bottom mb-3 mb-md-5 mt-4">Hi, {userName}</h1>

      <div className="row flex-column-reverse flex-md-row  justify-content-between">
        <div className="col-12 col-md-4 d-flex flex-column position-relative my-5 my-md-0">
          <div className="button-container">
            <NavLink to={SETTINGS_PAGE_LINK}>
              <button
                type="button"
                className="btn btn-outline-secondary w-75 mb-4"
              >
                Settings
              </button>
            </NavLink>
            <button
              type="button"
              className="btn btn-outline-danger w-75"
              onClick={signOut}
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <h2>Profile details</h2>
          <div className="col-12 col-md-10 alert-box mb-2">
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
          </div>

          <InputText
            labelText="Email:"
            value={userEmail}
            inputPayload={(value) =>
              setUserInfo((prevState) => ({ ...prevState, email: value }))
            }
            id="email"
            errorHandler={(value) => inputValidation(value)}
          />
          <InputText
            labelText="Name:"
            inputPayload={(value) =>
              setUserInfo((prevState) => ({ ...prevState, firstName: value }))
            }
            id="name"
            value={userName}
            errorHandler={(value) => inputValidation(value)}
          />
          <button
            type="button"
            onClick={changeUserData}
            disabled={!isValueValid}
            className="btn btn-green col-12 col-md-6 mt-3"
          >
            Update contacts
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="loader" />
  );
};
export default ProfilePage;
