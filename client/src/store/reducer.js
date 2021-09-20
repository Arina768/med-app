import { LOGIN_ACTION } from "../constants";

const appState = {
  userName: "admin",
  id: "admin",
};

export default function appReducer(state = appState, action) {
  switch (action.type) {
    case LOGIN_ACTION: {
      return {
        ...state,
        userName: action.payload.userName,
        id: action.payload.id,
      };
    }

    default:
      return state;
  }
}
