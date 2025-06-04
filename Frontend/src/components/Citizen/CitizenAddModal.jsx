import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import CitizenInfo from "./CitizenInfo";
import "./CitizenInfo.css";

const CitizenAddModal = ({ open, onClose, householdNumber, onAddCitizen }) => {
  const [citizen, setCitizen] = useState({
    name: "",
    household: householdNumber || "",
    gender: "",
    birth_date: "",
    hometown: "",
    cccd: "",
    cccdIssueDate: "",
    cccdIssuePlace: "",
    status: "Sinh sống",
  });

  // Reset lại mã hộ dân mỗi khi modal mở hoặc householdNumber thay đổi
  useEffect(() => {
    if (open) {
      setCitizen((c) => ({
        ...c,
        household: householdNumber || "",
      }));
    }
  }, [open, householdNumber]);

  const handleChange = (e) => {
    setCitizen({ ...citizen, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (
      !citizen.name ||
      !citizen.household ||
      !citizen.gender ||
      !citizen.birth_date ||
      !citizen.hometown ||
      !citizen.cccd ||
      !citizen.cccdIssueDate ||
      !citizen.cccdIssuePlace
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8000/HouseHold_Resident/citizens/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: citizen.name,
            household: parseInt(citizen.household, 10),
            gender: citizen.gender === "Nam" ? "male" : "female",
            birth_date: citizen.birth_date,
            origin_place: citizen.hometown,
            id_card_number: citizen.cccd,
            id_card_issue_date: citizen.cccdIssueDate,
            id_card_issue_place: citizen.cccdIssuePlace,
            status:
              citizen.status === "Sinh sống"
                ? "sinh_song"
                : citizen.status === "Tạm trú"
                ? "tam_tru"
                : citizen.status === "Tạm vắng"
                ? "tam_vang"
                : "sinh_song",
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Đã thêm cư dân mới!");
        if (onAddCitizen) onAddCitizen();
        setCitizen({
          name: "",
          household: householdNumber || "",
          gender: "",
          birth_date: "",
          hometown: "",
          cccd: "",
          cccdIssueDate: "",
          cccdIssuePlace: "",
          status: "Sinh sống",
        });
        onClose();
        window.location.reload(); // Reload the page to reflect changes
      } else {
        alert(data.detail || "Thêm cư dân thất bại!");
      }
    } catch (err) {
      console.error("Error adding citizen:", err);
      alert("Lỗi kết nối tới server!");
    }
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
            <label>Mã hộ dân: </label>
            <input
              name="household"
              value={citizen.household}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div>
            <label>Giới tính: </label>
            <select name="gender" value={citizen.gender} onChange={handleChange}>
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div>
            <label>Ngày sinh: </label>
            <input
              name="birth_date"
              type="date"
              value={citizen.birth_date}
              onChange={handleChange}
            />
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
            <input
              name="cccdIssueDate"
              type="date"
              value={citizen.cccdIssueDate}
              onChange={handleChange}
            />
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