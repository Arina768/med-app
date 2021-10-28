import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ServiceModal from "../../service/serviceModal";

import Modal from "../../elements/modal/modal";
import { USER_VISIT_PATH } from "../../constants";
import "./styles.scss";
import {
  addNewEventAction,
  changeEventAction,
  deleteEventAction,
} from "../../store/actions/serviceActions";

const ExistingVisitModal = ({ closeModal, visitInfo }) => {
  const [newVisitModal, setNewVisitModal] = useState(false);
  const [appointmentNotification, setAppointmentNotification] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [closeAppointment, setCloseAppointment] = useState({});
  const [newDate, setNewDate] = useState(
    new Date().toLocaleDateString("en-ca")
  );
  const dispatch = useDispatch();

  const [visits, setVisits] = useState(visitInfo.events);

  const [errorMsg, setErrorMsg] = useState(false);

  const userId = useSelector((appState) => appState.id);
  const modifyAppointment = async (
    appointmentId,
    serviceId,
    method,
    newAppointmentDate = "",
    addAppointmentInYear = false
  ) => {
    const reqData = {
      appointmentId,
      userId,
      serviceId,
      newAppointmentDate,
      addAppointmentInYear,
    };

    const path = method === "POST" ? USER_VISIT_PATH + "done" : USER_VISIT_PATH;
    try {
      const req = await fetch(path, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });

      if (req.status === 200) {
        const res = await req.json();
        const newVisitsList = visits.filter(
          (item) => item.appointmentId !== appointmentId
        );
        setVisits(newVisitsList);
        setErrorMsg(false);

        if (method === "DELETE" && res.affected) {
          setAppointmentNotification("Appointment successfully deleted");
          dispatch(deleteEventAction(serviceId));
        }
        if (method === "PUT") {
          setAppointmentNotification("Appointment successfully changed");
          dispatch(changeEventAction(res));
        }
        if (method === "POST") {
          dispatch(deleteEventAction(serviceId));
          dispatch(addNewEventAction(res));
          setAppointmentNotification("Appointment successfully closed");
        }
      } else {
        setErrorMsg(true);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(true);
    }
    setCloseAppointment(null);
  };

  return !newVisitModal ? (
    <Modal closeModal={closeModal}>
      <>
        <div className="d-flex justify-content-between modal__title">
          <h2>{visitInfo.date.toDateString()}</h2>
          <button
            type="button"
            className="btn btn-green h-25"
            onClick={() => setNewVisitModal(true)}
          >
            Add new appointment
          </button>
        </div>

        <div className="existing-modal modal__content">
          {appointmentNotification && (
            <div className="alert alert-success" role="alert">
              {appointmentNotification}
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              Something went wrong
            </div>
          )}
          {!!visits.length &&
            visits.map((item) => (
              <div key={item.id}>
                <p className="text-capitalize">{item.name}</p>
                {item.lastVisit && (
                  <p>Last visit: {new Date(item.lastVisit).toDateString()}</p>
                )}
                {showDateInput && (
                  <div className="form-group mb-4">
                    <label>
                      Choose new date for appointment:
                      <input
                        type="date"
                        className="form-control"
                        id="start"
                        name="service-date"
                        value={newDate}
                        min={new Date().toLocaleDateString("en-ca")}
                        onChange={(event) => setNewDate(event.target.value)}
                        max="2055-12-31"
                      ></input>
                    </label>
                  </div>
                )}

                {closeAppointment &&
                closeAppointment.appointmentId &&
                closeAppointment.appointmentId === item.appointmentId ? (
                  <div>
                    <h4>Add a new visit in a year? </h4>
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="button"
                        className="btn btn-green col-3 me-2"
                        onClick={() =>
                          modifyAppointment(
                            closeAppointment.appointmentId,
                            closeAppointment.serviceId.toString(),
                            "POST",
                            null,
                            true
                          )
                        }
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-light col-3"
                        onClick={() =>
                          modifyAppointment(
                            closeAppointment.appointmentId,
                            closeAppointment.serviceId.toString(),
                            "POST"
                          )
                        }
                      >
                        No
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between">
                    {!showDateInput ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => setCloseAppointment(item)}
                        >
                          Mark as visited
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowDateInput(true)}
                        >
                          Change date
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() =>
                            modifyAppointment(
                              item.appointmentId,
                              item.serviceId.toString(),
                              "DELETE"
                            )
                          }
                        >
                          Delete appointment
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          modifyAppointment(
                            item.appointmentId,
                            item.serviceId.toString(),
                            "PUT",
                            newDate
                          )
                        }
                      >
                        Change date
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          <button
            type="button"
            className="btn modal__btn mt-5"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </>
    </Modal>
  ) : (
    <ServiceModal closeModal={() => setNewVisitModal(false)} />
  );
};
export default ExistingVisitModal;
