import React from "react";
import Modal from "../Modal/Modal";
import FeeDetailEdit from "./FeeDetailEdit";

const FeeDetailEditModal = ({ open, onClose, fee }) => (
  <Modal open={open} onClose={onClose}>
    <FeeDetailEdit fee={fee} />
  </Modal>
);

export default FeeDetailEditModal;