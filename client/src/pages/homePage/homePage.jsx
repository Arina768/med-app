import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Calendar from "rc-year-calendar";
import ExistingVisitModal from "./existingVisitModal";
import ServiceModal from "../../service/serviceModal";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { getAllEvents } from "../../store/actions/serviceActions";
import formatEventsInfo from "./formatEventsInfo";
import AdminPage from "../adminPage/adminPage";

const HomePage = () => {
  const [visits, setVisits] = useState([]);
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState({});
  const [newVisitModal, setNewVisitModal] = useState(false);
  const [percentage, setPercentage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRole = useSelector((appState) => appState.role);
  const dispatch = useDispatch();

  const userId = localStorage.getItem("id");
  const userEvents = useSelector((appState) => appState.userEvents);

  useEffect(() => {
    if (userEvents && userEvents.length) {
      const { percentage, formatedInfo } = formatEventsInfo(userEvents);

      setPercentage(percentage);
      setVisits(formatedInfo);
      setIsLoading(false);
    }
  }, [percentage, userEvents]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      dispatch(getAllEvents(userId));
    }
  }, [dispatch, userId]);

  const handleDayClick = (date) => {
    setSelectedDateInfo(date);

    if (date.events && date.events.length) {
      setCalendarModal(true);
    } else {
      setNewVisitModal(true);
    }
  };
  return (
    <>
      {userId && userRole !== "admin" && (
        <div className="container">
          {!isLoading ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3 mt-4 flex-column-reverse flex-md-row flex-wrap">
                <div className="col-12 col-md-6">
                  <h2 className="mb-3">Upcoming appointments:</h2>
                  {visits.length &&
                    [0, 1, 2].map(
                      (value) =>
                        visits[value] && (
                          <div key={visits[value].id} className="pb-2">
                            <button
                              type="button"
                              className="btn btn-light me-3"
                            >
                              {visits[value].startDate.toLocaleDateString(
                                "en-ca"
                              )}
                            </button>
                            <span className="text-capitalize">
                              {visits[value].name}
                            </span>
                          </div>
                        )
                    )}
                  <button
                    type="button"
                    className="btn btn-green h-25 mt-3 col-12 col-md-7 col-lg-5"
                    onClick={() => {
                      setSelectedDateInfo(null);
                      setNewVisitModal(true);
                    }}
                  >
                    Add new appointment
                  </button>
                </div>

                {percentage !== null && (
                  <div className="d-flex flex-column align-items-center mb-5">
                    <h2>This year progress:</h2>
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                    />
                  </div>
                )}
              </div>

              <Calendar
                dataSource={visits}
                onDayClick={handleDayClick}
                minDate={new Date()}
                displayDisabledDataSource
              />
            </>
          ) : userEvents === null ? (
            <div className="d-flex flex-column align-items-center mt-4">
              <h2>Preparing your statistics...</h2>
              <div className="loader" />
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center mt-5">
              <h2>Add your first visit!</h2>
              <button
                type="button"
                className="btn btn-green h-25 mt-3 col-12 col-md-7 col-lg-5"
                onClick={() => {
                  setSelectedDateInfo(null);
                  setNewVisitModal(true);
                }}
              >
                Click
              </button>
            </div>
          )}
        </div>
      )}
      {userId && userRole === "admin" && <AdminPage />}
      {!userId && (
        <div className="landing-wrapper">
          <div className="landing">
            <h2>YOUR MEDICAL CALENDAR</h2>
            <h3 className="mb-3 pb-3">It's time to think about your health!</h3>
            <p>
              Your Medical Calendar will allow you to keep track of all your
              appointments.
            </p>
            <p class="fw-bold">Forget to visit the dentist twice a year?</p>
            <p>
              This app will schedule a new appointment six months after the last
              one.
            </p>
            <p class="fw-bold">Haven't had your blood checked in a while?</p>
            <p>
              Simply select the service you want and add it to your calendar.
            </p>
          </div>
        </div>
      )}
      {calendarModal && (
        <ExistingVisitModal
          closeModal={() => setCalendarModal(false)}
          visitInfo={selectedDateInfo}
        />
      )}
      {newVisitModal && (
        <ServiceModal
          closeModal={() => setNewVisitModal(false)}
          selectedDate={
            selectedDateInfo
              ? selectedDateInfo.date.toLocaleDateString("en-ca")
              : new Date().toLocaleDateString("en-ca")
          }
        />
      )}
    </>
  );
};

export default HomePage;
