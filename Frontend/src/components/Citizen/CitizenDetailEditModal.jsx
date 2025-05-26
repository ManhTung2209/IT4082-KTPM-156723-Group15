import React from "react";
import Modal from "../Modal/Modal";
import CitizenDetailEdit from "./CitizenDetailEdit";

const CitizenDetailEditModal = ({ open, onClose, citizen }) => (
  <Modal open={open} onClose={onClose}>
    <CitizenDetailEdit citizen={citizen} />
  </Modal>
);

export default CitizenDetailEditModal;