import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useSelector } from "react-redux";
import { SAVE_FORM_PATH, SEARCH_PATH } from "../../constants";
import { DateInput } from "./dateInput";
import { PROFILE_PAGE_LINK } from "../../router/routes";

const RegistrationFormPage = () => {
  const [basicService, setBasicService] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const id = useSelector((appState) => appState.id);
  const history = useHistory();

  useEffect(() => {
    const getServices = async () => {
      try {
        const request = await fetch(`${SEARCH_PATH}?basicService=true`);

        if (request.status === 200) {
          const response = await request.json();

          setBasicService(response);
        }
      } catch (e) {
        console.error(e);
      }
    };
    getServices();
  }, []);
  const saveAppointmentDate = (value, field, id) => {
    const userServices = basicService.map((service) => {
      if (service._id === id) {
        service[field] = value;
      }
      return service;
    });
    setBasicService(userServices);
  };
  const saveForm = async () => {
    try {
      const reqData = {
        servicesInfo: basicService,
        userId: id,
      };
      const req = await fetch(SAVE_FORM_PATH, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      if (req.status === 200) {
        setErrorMsg(false);
        history.push(PROFILE_PAGE_LINK);
      } else {
        setErrorMsg(true);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(true);
    }
  };
  return (
    <div className="container">
      <h1 className="mt-4">Registration Form</h1>
      {errorMsg && <p>Something went wrong</p>}
      <p>Please fill out the basic form</p>
      {!!basicService.length ? (
        basicService.map((service) => (
          <>
            <h2 className="text-capitalize border-bottom">{service.name}</h2>
            <p className="fst-italic mb-3">
              This procedure should be attended {service.visitsPerYear} time per
              year
            </p>
            <DateInput
              service={service}
              payload={saveAppointmentDate}
              key={service._id}
              lastVisit
            />
          </>
        ))
      ) : (
        <div className="loader" />
      )}
      <button type="button" className="btn btn-green mt-3" onClick={saveForm}>
        Add to my calendar
      </button>
    </div>
  );
};
export default RegistrationFormPage;
