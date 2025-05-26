import React from "react";
import "./Modal.css";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;