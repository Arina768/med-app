export const LOGIN_ACTION = "login";
export const SEARCH_RESULT_ACTION = "search";

export const GET_EVENTS_ACTION = "getEvents";
export const ADD_NEW_EVENT_ACTION = "addNewEvent";
export const DELETE_EVENT_ACTION = "deleteEvent";
export const CHANGE_EVENT_ACTION = "changeEvent";

export const GET_SERVICES_ACTION = "getServices";

const SERVER_PATH = "//localhost:5000";

export const SIGNIN_PATH = `${SERVER_PATH}/auth/login`;

export const SIGNUP_PATH = `${SERVER_PATH}/auth/register`;
export const SEARCH_PATH = `${SERVER_PATH}/services`;
export const PROFILE_INFO_PATH = `${SERVER_PATH}/user/`;
export const CHANGE_PASSWORD_PATH = `${SERVER_PATH}/user/password`;

export const REFRESH_TOKEN = `${SERVER_PATH}/auth/token`;

export const USER_VISIT_PATH = `${SERVER_PATH}/user/service/`;
export const SAVE_FORM_PATH = `${SERVER_PATH}/user/form`;

export const ADMIN_SERVICE_PATH = `${SERVER_PATH}/admin/service`;

export const PARAM_ALL_SERVICES = "89332";
