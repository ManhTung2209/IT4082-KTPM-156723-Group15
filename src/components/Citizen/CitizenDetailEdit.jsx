import React, { useState, useEffect } from "react";
import CitizenInfo from "./CitizenInfo";
import { useNavigate } from "react-router-dom";
import HouseholdInfoModal from "../Household/HouseholdInfoModal";
import { mockHouseholds } from "../../pages/Household";

const CitizenDetailEdit = ({ citizen }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCitizen, setEditedCitizen] = useState(citizen);
  const navigate = useNavigate();

  const [householdModalOpen, setHouseholdModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  // Cập nhật lại state khi prop citizen thay đổi
  useEffect(() => {
    setEditedCitizen(citizen);
    setEditMode(false); // Reset về chế độ xem khi mở modal mới
  }, [citizen]);

  const handleChange = (e) => {
    setEditedCitizen({ ...editedCitizen, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Gọi API lưu thông tin mới ở đây
    setEditMode(false);
    alert("Đã lưu thông tin mới!");
  };

  if (!editedCitizen) return null; // Tránh lỗi khi chưa có dữ liệu

  return (
    <div>
      <h2>Thông tin cư dân</h2>
      {editMode ? (
        <div className="citizen-info-edit">
        <div className="info-grid">
        <div>
          <label>Họ tên: </label>
          <input name="name" value={editedCitizen.name} onChange={handleChange} />
        </div>
        <div>
          <label>Số phòng: </label>
          <input name="household" value={editedCitizen.household} onChange={handleChange} />
        </div>
        <div>
          <label>Giới tính: </label>
          <input name="gender" value={editedCitizen.gender} onChange={handleChange} />
        </div>
        <div>
          <label>Năm sinh: </label>
          <input name="birthYear" value={editedCitizen.birthYear} onChange={handleChange} />
        </div>
        <div>
          <label>Quê quán: </label>
          <input name="hometown" value={editedCitizen.hometown} onChange={handleChange} />
        </div>
        <div>
          <label>Mã CCCD: </label>
          <input name="cccd" value={editedCitizen.cccd} onChange={handleChange} />
        </div>
        <div>
          <label>Ngày cấp: </label>
          <input name="cccdIssueDate" value={editedCitizen.cccdIssueDate} onChange={handleChange} />
        </div>
        <div>
          <label>Nơi cấp: </label>
          <input name="cccdIssuePlace" value={editedCitizen.cccdIssuePlace} onChange={handleChange} />
        </div>
        <div>
          <label>Trạng thái: </label>
          <select name="status" value={editedCitizen.status} onChange={handleChange}>
            <option value="Sinh sống">Sinh sống</option>
            <option value="Tạm trú">Tạm trú</option>
            <option value="Tạm vắng">Tạm vắng</option>
          </select>
        </div>
        </div> 
        </div>
      ) : (
        <CitizenInfo citizen={editedCitizen} />
      )}
      <div style={{ marginTop: 20 }}>
        {!editMode ? (
    <>
      <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
      <button
        style={{ marginLeft: 12 }}
        onClick={() => {
          const household = mockHouseholds.find(
            h => String(h.householdNumber) === String(editedCitizen.household)
          );
          setSelectedHousehold(household);
          setHouseholdModalOpen(true);
          }}
          >
        Xem thông tin hộ dân
        </button>
        <button
        style={{ marginLeft: 12 }}
        onClick={() => {
          // Xử lý xóa cư dân ở đây (API hoặc cập nhật state)
          if (window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
            // TODO: Gọi API hoặc cập nhật state cha
            alert("Đã xóa cư dân!");
          }
        }}
      >
        Xóa cư dân
      </button>
        </>
        ) : (
        <button onClick={handleSave}>Lưu thông tin</button>
        )}
        <HouseholdInfoModal
          open={householdModalOpen}
          onClose={() => setHouseholdModalOpen(false)}
          household={selectedHousehold}
        />
      </div>
    </div>
  );
};

export default CitizenDetailEdit;