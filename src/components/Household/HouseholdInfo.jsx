import React, { useState, useEffect } from "react";
import "./HouseholdInfo.css";
import { mockCitizens } from "../../pages/Citizen";
import CitizenTable from "../Citizen/CitizenTable";
import CitizenDetailEditModal from "../Citizen/CitizenDetailEditModal";
import CitizenAddModal from "../Citizen/CitizenAddModal"; // Đảm bảo đã có component này


const HouseholdInfo = ({ household }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedHousehold, setEditedHousehold] = useState(household);

  // Thêm state cho modal chi tiết cư dân
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [citizenModalOpen, setCitizenModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);


  useEffect(() => {
    setEditedHousehold(household);
    setEditMode(false);
  }, [household]);

  if (!editedHousehold) return <div>Không có dữ liệu căn hộ.</div>;

  const handleChange = (e) => {
    setEditedHousehold({ ...editedHousehold, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if(!editedHousehold.householdNumber || !editedHousehold.owner){
      alert("Vui lòng nhập số nhà và chủ hộ");
      return;
    }
    setEditMode(false);
    alert("Đã lưu thông tin hộ dân!");
  };

  // Lọc cư dân thuộc hộ dân này
  const citizensInHousehold = mockCitizens.filter(
    c => String(c.household) === String(editedHousehold.householdNumber)
  );

  // Đếm số dân cư đang cư trú (Sinh sống hoặc Tạm trú)
  const livingCount = citizensInHousehold.filter(
    c => c.status === "Sinh sống" || c.status === "Tạm trú"
  ).length;

  // Hàm xử lý khi bấm vào hàng cư dân
  const handleRowClick = (citizen) => {
    setSelectedCitizen(citizen);
    setCitizenModalOpen(true);
  };

  return (
    <div>
      <h2>Thông tin hộ dân</h2>
      <div className="household-info">
        {editMode ? (
          <div className="info-grid">
            <div>
              <label>Mã hộ dân: </label>
              <input name="householdNumber" value={editedHousehold.householdNumber} onChange={handleChange} />
            </div>
            <div>
              <label>Chủ hộ: </label>
              <input name="owner" value={editedHousehold.owner} onChange={handleChange} />
            </div>
          </div>
        ) : (
          <>
            <div><strong>Mã hộ dân:</strong> {editedHousehold.householdNumber}</div>
            <div><strong>Chủ hộ:</strong> {editedHousehold.owner}</div>
            <div><strong>Số dân cư đang cư trú:</strong> {livingCount}</div>
          </>
        )}
        <div style={{ marginTop: 20 }}>
          {!editMode ? (
            <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
          ) : (
            <button onClick={handleSave}>Lưu thông tin</button>
          )}
        </div>
        <div className="citizen-list">
          <h3>Danh sách cư dân thuộc hộ dân này</h3>
          <CitizenTable
            citizens={citizensInHousehold}
            onRowClick={handleRowClick}
          />
          <button
            style={{ marginBottom: 12 }}
            onClick={() => setAddModalOpen(true)}
          >
            Thêm cư dân
          </button>
        </div>
      </div>
      {/* Modal chi tiết cư dân */}
      <CitizenDetailEditModal
        open={citizenModalOpen}
        onClose={() => setCitizenModalOpen(false)}
        citizen={selectedCitizen}
      />
      {/* Modal thêm cư dân */}
      <CitizenAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        householdNumber={editedHousehold.householdNumber}
        // Có thể truyền thêm callback onAddCitizen nếu muốn reload danh sách
      />
    </div>
  );
};

export default HouseholdInfo;