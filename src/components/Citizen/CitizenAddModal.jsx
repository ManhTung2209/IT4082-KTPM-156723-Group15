import React, { useState } from "react";
import Modal from "../Modal/Modal";
import CitizenInfo from "./CitizenInfo";
import "./CitizenInfo.css";

const CitizenAddModal = ({ open, onClose, defaultHousehold }) => {
  const [citizen, setCitizen] = useState({
    name: "",
    household: defaultHousehold || "",
    gender: "",
    birthYear: "",
    hometown: "",
    cccd: "",
    cccdIssueDate: "",
    cccdIssuePlace: "",
    status: "Đang ở",
  });

  const handleChange = (e) => {
    setCitizen({ ...citizen, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    // Gọi API thêm cư dân ở đây
    alert("Đã thêm cư dân mới!");
    setCitizen({
      name: "",
      household: defaultHousehold || "",
      gender: "",
      birthYear: "",
      hometown: "",
      cccd: "",
      cccdIssueDate: "",
      cccdIssuePlace: "",
      status: "",
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Thêm cư dân mới</h2>
      <div className="citizen-info-edit">
        <div className="info-grid">
        <div>
          <label>Họ tên: </label>
          <input name="name" value={citizen.name} onChange={handleChange} />
        </div>
        <div>
          <label>Số phòng: </label>
          <input name="household" value={citizen.household} onChange={handleChange} />
        </div>
        <div>
          <label>Giới tính: </label>
          <input name="gender" value={citizen.gender} onChange={handleChange} />
        </div>
        <div>
          <label>Năm sinh: </label>
          <input name="birthYear" value={citizen.birthYear} onChange={handleChange} />
        </div>
        <div>
          <label>Quê quán: </label>
          <input name="hometown" value={citizen.hometown} onChange={handleChange} />
        </div>
        <div>
          <label>Mã CCCD: </label>
          <input name="cccd" value={citizen.cccd} onChange={handleChange} />
        </div>
        <div>
          <label>Ngày cấp: </label>
          <input name="cccdIssueDate" value={citizen.cccdIssueDate} onChange={handleChange} />
        </div>
        <div>
          <label>Nơi cấp: </label>
          <input name="cccdIssuePlace" value={citizen.cccdIssuePlace} onChange={handleChange} />
        </div>
        <div>
          <label>Trạng thái: </label>
          <select name="status" value={citizen.status} onChange={handleChange}>
            <option value="Sinh sống">Sinh sống</option>
            <option value="Tạm trú">Tạm trú</option>
            <option value="Tạm vắng">Tạm vắng</option>
          </select>
        </div>
      </div>
      </div>
      <button style={{ marginTop: 20 }} onClick={handleAdd}>
        Thêm cư dân
      </button>
      <h3 style={{ marginTop: 24 }}>Xem trước thông tin:</h3>
      <CitizenInfo citizen={citizen} />
    </Modal>
  );
};

export default CitizenAddModal;