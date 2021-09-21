import { Dropdown } from "bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import SignIn from "../auth/signIn";
import SignUp from "../auth/signUp";

export const Header = () => {
  const [signInModal, setSignInModal] = useState(false);
  const [signUpModal, setSignUpModal] = useState(false);
  const userName = useSelector((appState) => appState.userName);
  // const id = useSelector((appState) => appState.id);
  const id = "";
  return (
    // <header className="d-flex justify-content-center">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="row w-100">
          <div className="col-2">
            <NavLink to="/">
              <img
                src="../../public/logo192.png"
                width="30"
                height="30"
                alt=""
              />
            </NavLink>
          </div>
          {/* <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button> */}
          {/* <div
            class="collapse navbar-collapse col-7"
            id="navbarSupportedContent"
          > */}
          {/* <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
          <form class="form-inline my-3 my-lg-0 col-7">
            <input
              class="form-control d-inline w-75"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              class="btn btn-outline-success my-2 my-sm-0 w-25"
              type="submit"
            >
              Search
            </button>
          </form>
          {/* </div> */}
          {id ? (
            <div className="col-3">
              <NavLink to="/profile">
                <p>{userName || "user"}</p>
              </NavLink>

              <p>logout</p>
            </div>
          ) : (
            <div className="col-3">
              <button type="button" onClick={() => setSignInModal(true)}>
                Sign in
              </button>
              <button type="button" onClick={() => setSignUpModal(true)}>
                Registration
              </button>
            </div>
          )}
        </div>
      </div>{" "}
      <>
        {signInModal && <SignIn closeModal={() => setSignInModal(false)} />}
        {signUpModal && <SignUp closeModal={() => setSignUpModal(false)} />}
      </>
    </nav>

    //  <div className="row justify-content-between">
    //   <div className="col-2">logo</div>
    //   <div class="mb-3 col-6">
    //     <input
    //       type="text"
    //       class="form-control"
    //       id="searchBar"
    //       placeholder="Search..."
    //     />
    //   </div>
    //  </header>
  );
};
