import { NavLink, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useDebounce } from "use-debounce";

import { useEffect, useState } from "react";
import SignIn from "../auth/signIn";
import SignUp from "../auth/signUp";
import ReactSearchBox from "react-search-box";
import { PARAM_ALL_SERVICES, SEARCH_PATH } from "../constants";
import ServiceModal from "../service/serviceModal";
import {
  HOME_PAGE_LINK,
  PROFILE_PAGE_LINK,
  SEARCH_PAGE_LINK,
} from "../router/routes";
import "./styles.scss";
import { loginAction } from "../store/actions/userActions";
import logo from "./logo.svg";

export const Header = () => {
  const [signInModal, setSignInModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const [selectedService, setSelectedService] = useState({});

  const [filteredOptions, setFilteredOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchTerm] = useDebounce(searchTerm.trim(), 300);
  const history = useHistory();
  const dispatch = useDispatch();

  const id = localStorage.getItem("id");

  useEffect(() => {
    async function searchRequest() {
      try {
        const req = await fetch(
          `${SEARCH_PATH}?name=${debouncedSearchTerm.toLowerCase()}`
        );
        const response = await req.json();
        if (!response) {
          setFilteredOptions([]);
          return;
        }
        const dataForDropdown = response.map((value) => {
          const formatedData = {
            value: value.name,
            key: value._id,
            info: value,
          };
          return formatedData;
        });
        setIsSearching(false);
        setFilteredOptions(dataForDropdown);
      } catch (e) {
        console.error(e);
      }
    }
    if (debouncedSearchTerm) {
      setIsSearching(true);

      searchRequest();
    } else {
      setFilteredOptions([]);
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleSelect = (selectedValue) => {
    setSelectedService(selectedValue.info);
  };

  const handleSearch = () => {
    setFilteredOptions([]);
    setSearchTerm("");
    window.location.href = `${SEARCH_PAGE_LINK}/${
      searchTerm || PARAM_ALL_SERVICES
    }`;
  };

  const signOut = () => {
    history.push(HOME_PAGE_LINK);
    localStorage.clear();
    dispatch(loginAction("", "", "", ""));
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light header__wrapper">
      <div className="container justify-content-center">
        <div className="row w-100">
          <div className="d-none col-md-2 d-md-flex justify-content-center align-items-center">
            <NavLink to="/">
              <img src={logo} width="30" height="30" alt="" />
            </NavLink>
          </div>

          {id ? (
            <form className="d-flex my-3 my-lg-0 col-12 col-md-7 align-items-center">
              <div className="col-9 position-relative">
                <ReactSearchBox
                  placeholder="Search for medical service"
                  data={filteredOptions.length ? filteredOptions : []}
                  onSelect={handleSelect}
                  onChange={(value) => setSearchTerm(value)}
                  fuseConfigs={{
                    threshold: 0.05,
                  }}
                  value={searchTerm}
                />
              </div>
              {isSearching ? (
                <div className="loader" />
              ) : (
                <button
                  className="btn btn-primary btn-green mx-2 col-3"
                  type="button"
                  onClick={handleSearch}
                >
                  Search
                </button>
              )}
            </form>
          ) : (
            <div className="d-flex my-3 my-lg-0 col-12 col-md-7 align-items-center justify-content-center">
              <h2 className="app-title">Your medical calendar</h2>
            </div>
          )}
          {id ? (
            <div className="col-12 col-md-3 d-flex flex-md-column h-75">
              <NavLink
                to={PROFILE_PAGE_LINK}
                className="btn btn-primary mb-md-2 col-6 col-md-12"
              >
                Profile
              </NavLink>

              <button
                type="button"
                className="btn btn-primary btn-logout col-6 col-md-12"
                onClick={signOut}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="col-12 col-md-3 d-flex flex-md-column h-75">
              <button
                type="button"
                className="btn btn-primary mb-md-2 col-6 col-md-12"
                onClick={() => setSignInModal(true)}
              >
                Sign in
              </button>
              <button
                type="button"
                className="btn btn-primary col-6 col-md-12"
                onClick={() => setSignUpModal(true)}
              >
                Registration
              </button>
            </div>
          )}
        </div>
      </div>
      <>
        {signInModal && <SignIn closeModal={() => setSignInModal(false)} />}
        {signUpModal && <SignUp closeModal={() => setSignUpModal(false)} />}
        {selectedService._id && (
          <ServiceModal
            serviceInfo={selectedService}
            closeModal={() => setSelectedService({})}
          />
        )}
      </>
    </nav>
  );
};
