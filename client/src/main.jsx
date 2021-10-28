import React, { Suspense, lazy, useEffect } from "react";

import { Footer } from "./footer/footer";
import { Header } from "./header/header";
import { Switch, Route } from "react-router-dom";

import "./styles/main.scss";
import {
  ADMIN_PAGE_LINK,
  HOME_PAGE_LINK,
  PROFILE_PAGE_LINK,
  REGISTRATION_FORM_PAGE_LINK,
  SEARCH_PAGE_LINK,
  SETTINGS_PAGE_LINK,
} from "./router/routes";
import { isExpired } from "./helpers/getExpirationDate";
import { getNewToken } from "./helpers/getNewToken";
import { getUserInfo } from "./store/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./router/privateRoute";
import AdminPage from "./pages/adminPage/adminPage";

const HomePage = lazy(() => import("./pages/homePage/homePage"));
const ProfilePage = lazy(() => import("./pages/profilePage/profilePage"));
const SettingsPage = lazy(() => import("./pages/profilePage/settingsPage"));
const SearchResultPage = lazy(() =>
  import("./pages/searchResultPage/searchResultPage")
);
const RegistrationFormPage = lazy(() =>
  import("./pages/registrationFormPage/registrationFormPage")
);

function App() {
  const dispatch = useDispatch();
  const userEmail = useSelector((appState) => appState.email);
  const userId = localStorage.getItem("id");
  const userRole = useSelector((appState) => appState.role);

  useEffect(() => {
    const tokenExp = localStorage.getItem("tokenExp");
    if (tokenExp && userId) {
      if (isExpired(tokenExp)) {
        getNewToken(userId);
      }
    }
    if (!userEmail && userId) {
      dispatch(getUserInfo(userId));
    }
  }, [dispatch, userEmail, userId]);
  return (
    <Suspense
      fallback={<div className="d-flex justify-content-center loader" />}
    >
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <Switch>
          <Route path={HOME_PAGE_LINK} component={HomePage} exact />
          <PrivateRoute
            authed={userId}
            path={PROFILE_PAGE_LINK}
            component={ProfilePage}
          />
          <Route
            path={SEARCH_PAGE_LINK + "/:searchParam"}
            component={SearchResultPage}
          />
          <PrivateRoute
            authed={userId}
            path={SETTINGS_PAGE_LINK}
            component={SettingsPage}
          />
          <PrivateRoute
            authed={userId}
            path={REGISTRATION_FORM_PAGE_LINK}
            component={RegistrationFormPage}
          />
          <PrivateRoute
            authed={userRole === "admin"}
            path={ADMIN_PAGE_LINK}
            component={AdminPage}
          />
        </Switch>
        <Footer />
      </div>
    </Suspense>
  );
}

export default App;
