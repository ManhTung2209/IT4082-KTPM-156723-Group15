import React from "react";
import Modal from "../Modal/Modal";
import ChargeDetailEdit from "./ChargeDetailEdit";

const ChargeDetailEditModal = ({ open, onClose, charge }) => (
  <Modal open={open} onClose={onClose}>
    <ChargeDetailEdit charge={charge} />
  </Modal>
);

export default ChargeDetailEditModal;