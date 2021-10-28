import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SignIn from "../auth/signIn";
import { ADMIN_SERVICE_PATH, USER_VISIT_PATH } from "../constants";
import Modal from "../elements/modal/modal";
import Select from "react-select";
import { addNewEventAction } from "../store/actions/serviceActions";
import { getAllServices } from "../store/actions/serviceActions";
import "./styles.scss";

const ServiceModal = ({
  closeModal,
  serviceInfo = {},
  selectedDate = new Date().toLocaleDateString("en-ca"),
}) => {
  const [signInModal, setSignInModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [chosenSevice, setChosenSevice] = useState(serviceInfo._id);
  const [loading, setLoading] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(selectedDate);
  const [lastAppointmentDate, setLastAppointmentDate] = useState(
    new Date().toLocaleDateString("en-ca")
  );
  const dispatch = useDispatch();

  const [appointmentSaved, setAppointmentSaved] = useState(false);
  const [appointmentExist, setAppointmentExist] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState(false);

  const userId = useSelector((appState) => appState.id);
  const userRole = useSelector((appState) => appState.role);
  const allServices = useSelector((appState) => appState.allServices);

  useEffect(() => {
    if (allServices.length) {
      const options = allServices.map((service) => {
        return {
          name: service.name,
          value: service,
          id: service._id,
          label: service.name,
        };
      });
      setServiceOptions(options);
      setShowForm(true);
      setLoading(false);
    }
  }, [allServices]);

  useEffect(() => {
    if (!serviceInfo._id && !allServices.length) {
      setLoading(true);
      dispatch(getAllServices());
    }
  }, [serviceInfo._id, dispatch, allServices]);

  const handleSelect = async ({ changeDate = false }) => {
    if (!userId) {
      setSignInModal(true);
    }
    if (showForm) {
      const reqData = {
        userId,
        appointmentDate,
        changeDate,
        lastVisitDate: lastAppointmentDate,
      };
      reqData.serviceId = serviceInfo._id || chosenSevice.id;

      try {
        const req = await fetch(USER_VISIT_PATH, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqData),
        });
        if (req.status === 200) {
          const res = await req.json();

          if (res.appointmentAlreadyExist) {
            setAppointmentExist(true);
          } else {
            dispatch(addNewEventAction(res));
            setAppointmentSaved(true);
            setAppointmentExist(false);
          }
        } else {
          setErrorMsg(true);
        }
      } catch (e) {
        console.error(e);
        setErrorMsg(true);
      }
    }
    setShowForm(true);
  };
  const handleDelete = async () => {
    const reqData = {
      id: serviceInfo._id,
    };

    try {
      const req = await fetch(ADMIN_SERVICE_PATH, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      if (req.status === 200) {
        setDeleteMsg(true);
      } else {
        setErrorMsg(true);
        setDeleteMsg(false);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(true);
      setDeleteMsg(false);
    }
  };

  return !signInModal ? (
    <Modal closeModal={closeModal}>
      <>
        {serviceInfo._id ? (
          <h2 className="modal__title text-capitalize">{serviceInfo.name}</h2>
        ) : (
          <h2 className="modal__title">Add new appointment</h2>
        )}
        <div className="service__modal modal__content">
          {deleteMsg && (
            <div className="alert alert-success" role="alert">
              Service successfully deleted
            </div>
          )}
          {appointmentSaved ? (
            <>
              <div className="alert alert-success" role="alert">
                Appointment successfully added to your calendar
              </div>
              <div>
                <p className="fw-bold">
                  Service name:{" "}
                  <span className="text-capitalize">{serviceInfo.name}</span>
                </p>

                <p className="fw-bold">
                  Visit date <span>{appointmentDate}</span>
                </p>
              </div>
              <button
                type="button"
                className="btn modal__btn mt-4"
                onClick={closeModal}
              >
                Close
              </button>
            </>
          ) : (
            <>
              {errorMsg && (
                <div className="alert alert-danger" role="alert">
                  Something went wrong
                </div>
              )}
              {serviceInfo._id ? (
                <>
                  <p>{serviceInfo.description}</p>
                  <p>
                    This procedure should be attended{" "}
                    {serviceInfo.visitsPerYear} time per year
                  </p>
                </>
              ) : (
                !!serviceOptions.length &&
                !loading && (
                  <div>
                    <p className="m-0">Please, select service:</p>
                    <Select
                      options={serviceOptions}
                      onChange={(value) => setChosenSevice(value)}
                    />
                  </div>
                )
              )}
              {loading && !serviceInfo._id && <div className="loader" />}

              {showForm && (
                <>
                  <div className="form-group">
                    <label className="d-flex flex-column fw-bold">
                      Please, select date for your next appointment:
                      <input
                        type="date"
                        className="form-control"
                        id="start"
                        name="trip-start"
                        value={appointmentDate}
                        min={new Date().toLocaleDateString("en-ca")}
                        onChange={(event) =>
                          setAppointmentDate(event.target.value)
                        }
                        max="2055-12-31"
                      ></input>
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="d-flex flex-column">
                      When was your last appointment?
                      <input
                        type="date"
                        className="form-control"
                        id="start"
                        name="trip-start"
                        value={lastAppointmentDate}
                        max={new Date().toLocaleDateString("en-ca")}
                        onChange={(event) =>
                          setLastAppointmentDate(event.target.value)
                        }
                      ></input>
                    </label>
                  </div>
                  {appointmentExist && (
                    <div>
                      <h5 className="mt-3">
                        You already have this appointment in your calendar.
                        Would you like to change the date of your visit?
                      </h5>
                      <div className="d-flex justify-content-end mt-3">
                        <button
                          type="button"
                          className="btn btn-green col-3 me-2"
                          onClick={() => handleSelect({ changeDate: true })}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="btn btn-light col-3"
                          onClick={closeModal}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              {userRole === "admin" ? (
                !deleteMsg && (
                  <div>
                    <button
                      type="button"
                      className="btn btn-danger w-100"
                      onClick={handleDelete}
                    >
                      Delete service
                    </button>
                  </div>
                )
              ) : (
                <button
                  type="button"
                  className="btn modal__btn mt-4"
                  onClick={handleSelect}
                  disabled={
                    (showForm && (!appointmentDate || !chosenSevice)) || !userId
                  }
                >
                  Add to my calendar
                </button>
              )}
            </>
          )}
        </div>
      </>
    </Modal>
  ) : (
    <SignIn closeModal={() => setSignInModal(false)} />
  );
};
export default ServiceModal;
