import React from "react";
import Modal from "../Modal/Modal";
import CitizenInfo from "./CitizenInfo";

const CitizenInfoModal = ({ open, onClose, citizen }) => (
  <Modal open={open} onClose={onClose}>
    <CitizenInfo citizen={citizen} />
  </Modal>
);

export default CitizenInfoModal;