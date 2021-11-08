import {
  ADD_NEW_EVENT_ACTION,
  CHANGE_EVENT_ACTION,
  DELETE_EVENT_ACTION,
  GET_EVENTS_ACTION,
  GET_SERVICES_ACTION,
  LOGIN_ACTION,
} from "../constants";

const appState = {
  email: "",
  id: "",
  firstName: "",
  role: "",
  userEvents: null,
  allServices: [],
};

export default function appReducer(state = appState, action) {
  switch (action.type) {
    case LOGIN_ACTION: {
      return {
        ...state,
        email: action.payload.email,
        id: action.payload.id,
        firstName: action.payload.firstName,
        role: action.payload.role,
      };
    }
    case GET_EVENTS_ACTION: {
      return {
        ...state,
        userEvents: action.payload.events,
      };
    }

    case ADD_NEW_EVENT_ACTION: {
      const newEvent = action.payload.newEvent;
      const newEventsList = [...state.userEvents];
      const eventIndex = newEventsList.findIndex(
        (item) => item.service.id === newEvent.service.id
      );
      if (eventIndex !== -1) {
        newEventsList[eventIndex] = newEvent;
      } else {
        newEventsList.push(newEvent);
      }
      return {
        ...state,
        userEvents: newEventsList,
      };
    }
    case DELETE_EVENT_ACTION: {
      const newEventsList = state.userEvents.filter(
        (item) =>
          item.service._id.toString() !== action.payload.serviceId.toString()
      );
      return {
        ...state,
        userEvents: newEventsList,
      };
    }

    case CHANGE_EVENT_ACTION: {
      const newEventsList = [...state.userEvents];
      const eventIndex = newEventsList.findIndex(
        (item) =>
          item.service._id.toString() ===
          action.payload.eventInfo.service._id.toString()
      );
      newEventsList[eventIndex] = action.payload.eventInfo;
      return {
        ...state,
        userEvents: newEventsList,
      };
    }

    case GET_SERVICES_ACTION: {
      return {
        ...state,
        allServices: action.payload.services,
      };
    }

    default:
      return state;
  }
}
