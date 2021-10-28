import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Calendar from "rc-year-calendar";
import ExistingVisitModal from "./existingVisitModal";
import ServiceModal from "../../service/serviceModal";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useHistory } from "react-router-dom";
import { ADMIN_PAGE_LINK } from "../../router/routes";
import { getAllEvents } from "../../store/actions/serviceActions";
import formatEventsInfo from "./formatEventsInfo";

const HomePage = () => {
  const [visits, setVisits] = useState([]);
  const [calendarModal, setCalendarModal] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState({});
  const [newVisitModal, setNewVisitModal] = useState(false);
  const [percentage, setPercentage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRole = useSelector((appState) => appState.role);
  const history = useHistory();
  const dispatch = useDispatch();

  const userId = localStorage.getItem("id");
  const userEvents = useSelector((appState) => appState.userEvents);

  useEffect(() => {
    if (userEvents.length) {
      const { percentage, formatedInfo } = formatEventsInfo(userEvents);

      setPercentage(percentage);
      setVisits(formatedInfo);
      setIsLoading(false);
    }
  }, [percentage, userEvents]);

  useEffect(() => {
    if (userRole === "admin") {
      history.push(ADMIN_PAGE_LINK);
    }
  });
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
  return userId ? (
    <div className="container">
      {!isLoading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 mt-4 flex-column-reverse flex-md-row flex-wrap">
            <div className="col-12 col-md-6">
              <h2 className="mb-3">Upcoming appointments:</h2>
              {visits.length ? (
                [0, 1, 2].map(
                  (value) =>
                    visits[value] && (
                      <div key={visits[value].id} className="pb-2">
                        <button type="button" className="btn btn-light me-3">
                          {visits[value].startDate.toLocaleDateString("en-ca")}
                        </button>
                        <span className="text-capitalize">
                          {visits[value].name}
                        </span>
                      </div>
                    )
                )
              ) : (
                <p>Add your first appointment</p>
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
      ) : (
        <div className="d-flex flex-column align-items-center mt-4">
          <h2>Preparing your statistics...</h2>
          <div className="loader" />
        </div>
      )}
    </div>
  ) : (
    <div className="landing-wrapper">
      <div className="landing">
        <h2>YOUR MEDICAL CALENDAR</h2>
        <h3>Take control of your health!</h3>
      </div>
    </div>
  );
};

export default HomePage;
