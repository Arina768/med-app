import React, { useState } from "react";

import { ADMIN_SERVICE_PATH } from "../../constants";
import InputText from "../../elements/inputText/inputText";

const AdminPage = () => {
  const [errorMsg, setErrorMsg] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visitsPerYear, setVisitsPerYear] = useState(1);
  const [basicService, setBasicService] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [visitsPerYearError, setVisitsPerYearError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const checkVisitsPerYear = (value) => {
    if (value <= 0) {
      setVisitsPerYearError("Please, choose valid value");
      setVisitsPerYear(value);
    } else {
      setVisitsPerYearError("");
      setVisitsPerYear(value);
    }
  };
  const saveService = async () => {
    try {
      const reqData = {
        name,
        description,
        visitsPerYear,
        basicService,
      };
      const req = await fetch(ADMIN_SERVICE_PATH, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      if (req.status === 200) {
        setErrorMsg(false);
        setSuccessMessage(true);
      } else {
        setErrorMsg(true);
        setSuccessMessage(false);
      }
    } catch (e) {
      console.error(e);
      setErrorMsg(true);
      setSuccessMessage(false);
    }
  };
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <h1 className="mt-4">Add new service</h1>
        <div className="col-12 col-md-6">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              Service was added successfully
            </div>
          )}
          {errorMsg && (
            <div className="alert alert-danger" role="alert">
              Something went wrong
            </div>
          )}
        </div>

        <form className="col-12 col-md-6 mt-4">
          <div className="form-group">
            <InputText
              labelText="Service name"
              inputPayload={(value) => setName(value)}
              id="name"
              enterSameValue
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="description" className=" col-12 col-md-10">
              Description
              <textarea
                className={`form-control ${descriptionError && "is-invalid"}`}
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setDescriptionError(!description)}
              />
            </label>
            <div className="error-message d-flex invalid-feedback">
              {descriptionError && <span>This field is required</span>}
            </div>
          </div>
          <div className="form-group">
            <InputText
              labelText="How often per year is it recommended to visit this service?"
              inputPayload={(value) => checkVisitsPerYear(value)}
              id="visitsPerYear"
              inputType="number"
              value={visitsPerYear}
              minValue={0}
              enterSameValue
              error={visitsPerYearError}
            />
          </div>
          <div className="form-check mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="basicService"
            />
            <label
              className="form-check-label"
              htmlFor="basicService"
              value={basicService}
              onChange={(e) => setBasicService(e.target.value)}
            >
              Is it a basic service?
            </label>
          </div>
          <button
            type="button"
            className="btn btn-green col-12 col-md-10 mt-3"
            onClick={saveService}
            disabled={
              visitsPerYearError || descriptionError || !name || !description
            }
          >
            Save service
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminPage;
