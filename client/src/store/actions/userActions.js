import {
  LOGIN_ACTION,
  PROFILE_INFO_PATH,
  SIGNIN_PATH,
  SIGNUP_PATH,
} from "../../constants";
import { getExpirationDate } from "../../helpers/getExpirationDate";

export const loginAction = (email, id, role, firstName) => ({
  type: LOGIN_ACTION,
  payload: { email, id, role, firstName },
});

export const userLogin = (email, userPassword) => async (dispatch) => {
  const data = {
    email,
    password: userPassword,
  };
  try {
    const req = await fetch(SIGNIN_PATH, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (req.status === 200) {
      const res = await req.json();
      const tokenExp = getExpirationDate(res.accessToken);
      localStorage.setItem("tokenExp", tokenExp.toString());

      localStorage.setItem("id", res.user._id);

      dispatch(
        loginAction(email, res.user._id, res.user.role, res.user.firstName)
      );
      return true;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const userRegistration =
  (email, userPassword, firstName, lastName) => async (dispatch) => {
    const data = {
      email,
      password: userPassword,
      firstName,
      lastName,
    };
    try {
      const req = await fetch(SIGNUP_PATH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await req.json();

      if (req.status === 200) {
        const tokenExp = getExpirationDate(res.tokens.accessToken);

        localStorage.setItem("tokenExp", tokenExp.toString());

        localStorage.setItem("id", res._id);
        dispatch(loginAction(email, res._id, res.role, res.firstName));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

export const changeUserInfo = (newData) => async (dispatch) => {
  try {
    const req = await fetch(PROFILE_INFO_PATH, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    });
    if (req.status === 200) {
      const res = await req.json();

      dispatch(
        loginAction(newData.email, newData._id, res.role, newData.firstName)
      );
      return true;
    }
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const getUserInfo = (id) => async (dispatch) => {
  try {
    const req = await fetch(`${PROFILE_INFO_PATH + id}`, {
      method: "GET",
      credentials: "include",
    });
    if (req.status === 200) {
      const res = await req.json();

      dispatch(loginAction(res.email, res._id, res.role, res.firstName));
    }
  } catch (e) {
    console.error(e);
  }
  return false;
};
