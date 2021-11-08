import { useState, useEffect } from "react";
import ServiceModal from "../../service/serviceModal";
import { useDispatch } from "react-redux";
import { PARAM_ALL_SERVICES, SEARCH_PATH } from "../../constants";
import "./styles.scss";

const SearchResultPage = (props) => {
  const [selectedService, setSelectedService] = useState({});
  const [servicesInfo, setServicesInfo] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    async function searchRequest() {
      const searchParam =
        props.match.params.searchParam === PARAM_ALL_SERVICES
          ? ""
          : props.match.params.searchParam;
      try {
        const req = await fetch(
          `${SEARCH_PATH}?name=${searchParam.toLowerCase()}`
        );

        const response = await req.json();
        if (!response) {
          setServicesInfo([]);
          return;
        }
        setServicesInfo(response);
        setIsLoading(false);
      } catch (e) {
        setIsError(true);
        setIsLoading(false);
        console.error(e);
      }
    }
    if (props.match.params && props.match.params.searchParam) {
      searchRequest();
    }
  }, [dispatch, props.match.params]);
  return (
    <div className="container search-result-page">
      {isLoading && <div className="loader d-flex justify-content-center" />}
      {isError && (
        <div className="alert alert-danger mt-4" role="alert">
          Something went wrong
        </div>
      )}
      {!isLoading && !isError && (
        <div className="row justify-content-between flex-column mt-4">
          <h1>Search Results</h1>
          {!!servicesInfo.length ? (
            servicesInfo.map((value) => (
              <button
                key={value._id}
                type="button"
                className="btn btn-link text-start text-capitalize"
                onClick={() => setSelectedService(value)}
              >
                {value.name}
              </button>
            ))
          ) : (
            <h3>
              Unfortunately, no results found for
              {props.match.params.searchParam}
            </h3>
          )}
        </div>
      )}

      {selectedService._id && (
        <ServiceModal
          serviceInfo={selectedService}
          closeModal={() => setSelectedService({})}
        />
      )}
    </div>
  );
};

export default SearchResultPage;
