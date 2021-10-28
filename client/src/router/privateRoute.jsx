import React from "react";
import { Route, Redirect } from "react-router-dom";
import { HOME_PAGE_LINK } from "./routes";

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: HOME_PAGE_LINK, state: { from: props.location } }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
