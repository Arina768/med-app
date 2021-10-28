import React, { useState } from "react";

export const DateInput = ({ service, payload, lastVisit }) => {
  const [inputValue, setInputValue] = useState(
    new Date().toLocaleDateString("en-ca")
  );
  const [lastVisitDate, setLastVisitDate] = useState(
    new Date().toLocaleDateString("en-ca")
  );
  const changeInputValue = (value, field, id) => {
    payload(value, field, id);
    if (field === "lastVisitDate") {
      setLastVisitDate(value);
    } else {
      setInputValue(value);
    }
  };
  return (
    <div key={service._id} className="col-12 col-md-6">
      <div className="form-group mb-4">
        <label className="w-100">
          Set new appointment for
          <span className="text-capitalize"> {service.name}:</span>
          <input
            type="date"
            id="start"
            className="form-control w-50"
            name="service-date"
            value={inputValue}
            min={new Date().toLocaleDateString("en-ca")}
            onChange={(event) =>
              changeInputValue(
                event.target.value,
                "appointmentDate",
                service._id
              )
            }
            max="2055-12-31"
          ></input>
        </label>
      </div>
      {lastVisit && (
        <div className="form-group mb-4">
          <label className="w-100">
            Do you remember the date of your last visit?
            <input
              type="date"
              id="start"
              className="form-control w-50"
              name="service-date"
              value={lastVisitDate}
              onChange={(event) =>
                changeInputValue(
                  event.target.value,
                  "lastVisitDate",
                  service._id
                )
              }
              max={new Date().toLocaleDateString("en-ca")}
            ></input>
          </label>
        </div>
      )}
    </div>
  );
};
