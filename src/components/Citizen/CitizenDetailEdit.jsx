import React, { useState } from "react";
import CitizenInfo from "./CitizenInfo";
import { useNavigate } from "react-router-dom";

const CitizenDetailEdit = ({ citizen }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCitizen, setEditedCitizen] = useState(citizen);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEditedCitizen({ ...editedCitizen, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Gọi API lưu thông tin mới ở đây
    setEditMode(false);
    alert("Đã lưu thông tin mới!");
  };

  return (
    <div>
      <h2>Thông tin cư dân</h2>
      {editMode ? (
        <div className="citizen-info-edit">
          <div>
            <label>Họ tên: </label>
            <input name="name" value={editedCitizen.name} onChange={handleChange} />
          </div>
          <div>
            <label>Tuổi: </label>
            <input name="age" value={editedCitizen.age} onChange={handleChange} />
          </div>
          <div>
            <label>Địa chỉ: </label>
            <input name="address" value={editedCitizen.address} onChange={handleChange} />
          </div>
          {/* Thêm các trường khác nếu cần */}
        </div>
      ) : (
        <CitizenInfo citizen={editedCitizen} />
      )}
      <div style={{ marginTop: 20 }}>
        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
        ) : (
          <button onClick={handleSave}>Lưu thông tin</button>
        )}
        <button
          style={{ marginLeft: 12 }}
          onClick={() => navigate(`/household/${editedCitizen.household}`)}
        >
          Xem thông tin căn hộ
        </button>
      </div>
    </div>
  );
};

export default CitizenDetailEdit;