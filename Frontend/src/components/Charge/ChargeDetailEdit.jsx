import React, { useState, useEffect } from "react";
import ChargeInfo from "./ChargeInfo";
import { useNavigate } from "react-router-dom";
import HouseholdInfoModal from "../Household/HouseholdInfoModal";

const ChargeDetailEdit = ({ charge }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCharge, setEditedCharge] = useState(charge);
  const navigate = useNavigate();

  const [householdModalOpen, setHouseholdModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  // Cập nhật lại state khi prop charge thay đổi
  useEffect(() => {
    setEditedCharge(charge);
    setEditMode(false); // Reset về chế độ xem khi mở modal mới
  }, [charge]);

  const handleChange = (e) => {
    setEditedCharge({ ...editedCharge, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (
      !editedCharge.id ||
      !editedCharge.householdNumber ||
      !editedCharge.owner ||
      !editedCharge.feeName ||
      !editedCharge.Type ||
      !editedCharge.amount ||
      !editedCharge.paidAt
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    // Gọi API lưu thông tin mới ở đây nếu cần
    setEditMode(false);
    alert("Đã lưu thông tin mới!");
  };

  const handleShowHousehold = async () => {
    if (!editedCharge || !editedCharge.householdNumber) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/HouseHold_Resident/households/${editedCharge.householdNumber}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Không tìm thấy thông tin hộ dân");
      const data = await response.json();
      setSelectedHousehold({
        ...data,
        householdNumber: data.household_id,
        owner: data.owner_name,
      });
      setHouseholdModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phiếu nộp này?")) {
      // TODO: Gọi API xóa phiếu nộp ở đây nếu cần
      alert("Đã xóa phiếu nộp!");
    }
  };

  if (!editedCharge) return null; // Tránh lỗi khi chưa có dữ liệu

  return (
    <div>
      <h2>Thông tin phiếu nộp</h2>
      {editMode ? (
        <div className="charge-info-edit">
          <div className="charge-info-grid">
            <div>
              <label>Mã phiếu: </label>
              <input name="id" value={editedCharge.id} onChange={handleChange} />
            </div>
            <div>
              <label>Mã hộ dân: </label>
              <input name="householdNumber" value={editedCharge.householdNumber} onChange={handleChange} />
            </div>
            <div>
              <label>Chủ hộ: </label>
              <input name="owner" value={editedCharge.owner} onChange={handleChange} />
            </div>
            <div>
              <label>Tên khoản thu: </label>
              <input name="feeName" value={editedCharge.feeName} onChange={handleChange} />
            </div>
            <div>
              <label>Loại khoản thu: </label>
              <select name="Type" value={editedCharge.Type} onChange={handleChange}>
                <option value="Bắt buộc">Bắt buộc</option>
                <option value="Tự nguyện">Tự nguyện</option>
              </select>
            </div>
            <div>
              <label>Số tiền: </label>
              <input name="amount" value={editedCharge.amount} onChange={handleChange} />
            </div>
            <div>
              <label>Ngày nộp: </label>
              <input name="paidAt" value={editedCharge.paidAt} onChange={handleChange} />
            </div>
          </div>
        </div>
      ) : (
        <ChargeInfo charge={editedCharge} />
      )}
      <div style={{ marginTop: 20 }}>
        {!editMode ? (
          <>
            <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
            <button
              style={{ marginLeft: 12 }}
              onClick={handleShowHousehold}
            >
              Xem thông tin hộ dân
            </button>
            <button
              style={{ marginLeft: 12 }}
              onClick={handleDelete}
            >
              Xóa phiếu nộp
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

export default ChargeDetailEdit;