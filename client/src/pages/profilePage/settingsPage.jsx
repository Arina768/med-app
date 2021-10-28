import React from "react";
import { useSelector } from "react-redux";
import UpdatePassword from "./updatePassword";

const SettingsPage = () => {
  const id = useSelector((appState) => appState.id);

  return (
    <div className="container">
      <h1 className="mt-4">Settings</h1>
      <h2 className="mt-3  pb-2 border-bottom">Password</h2>

      <UpdatePassword id={id} />
    </div>
  );
};

export default SettingsPage;
