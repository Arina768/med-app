import { Dispatch } from "react";
import { Action } from "redux";
import { LOGIN_ACTION } from "../constants";

export const loginAction = (userName, id) => ({
  type: LOGIN_ACTION,
  payload: { userName, id },
});
