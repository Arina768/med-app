import {
  GET_EVENTS_ACTION,
  USER_VISIT_PATH,
  ADD_NEW_EVENT_ACTION,
  DELETE_EVENT_ACTION,
  CHANGE_EVENT_ACTION,
  SEARCH_PATH,
  GET_SERVICES_ACTION,
} from "../../constants";

export const getEventsAction = (events) => ({
  type: GET_EVENTS_ACTION,
  payload: { events },
});

export const addNewEventAction = (newEvent) => ({
  type: ADD_NEW_EVENT_ACTION,
  payload: { newEvent },
});

export const deleteEventAction = (serviceId) => ({
  type: DELETE_EVENT_ACTION,
  payload: { serviceId },
});

export const changeEventAction = (eventInfo) => ({
  type: CHANGE_EVENT_ACTION,
  payload: { eventInfo },
});

export const getServicesAction = (services) => ({
  type: GET_SERVICES_ACTION,
  payload: { services },
});

export const getAllEvents = (userId) => async (dispatch) => {
  try {
    const req = await fetch(USER_VISIT_PATH + userId, {
      method: "GET",
      credentials: "include",
    });
    if (req.status === 200) {
      const res = await req.json();
      dispatch(getEventsAction(res));
    }
  } catch (e) {
    console.error(e);
  }
};

export const getAllServices = () => async (dispatch) => {
  try {
    const req = await fetch(SEARCH_PATH);
    if (req.status === 200) {
      const res = await req.json();
      dispatch(getServicesAction(res));
    }
  } catch (e) {
    console.error(e);
  }
};
