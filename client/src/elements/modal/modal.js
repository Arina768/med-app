import useOnClickOutside from "../../helpers/useOnClikcOutside";
import React, { useEffect, useMemo } from "react";
import ReactDOM from "react-dom";

import "./styles.scss";

const Modal = ({ children, closeModal = () => {} }) => {
  const el = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    const target = document.body;
    el.classList.add("modal-container");

    target.appendChild(el);
    return () => {
      target.removeChild(el);
    };
  }, [el]);
  useOnClickOutside(el, closeModal);

  return ReactDOM.createPortal(children, el);
};

export default Modal;
