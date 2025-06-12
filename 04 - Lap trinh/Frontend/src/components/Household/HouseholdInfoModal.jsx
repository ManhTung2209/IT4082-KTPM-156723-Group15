import React from "react";
import Modal from "../Modal/Modal";
import HouseholdInfo from "./HouseholdInfo";

const HouseholdInfoModal = ({ open, onClose, household }) => (
  <Modal open={open} onClose={onClose}>
    <HouseholdInfo household={household} />
  </Modal>
);

export default HouseholdInfoModal;