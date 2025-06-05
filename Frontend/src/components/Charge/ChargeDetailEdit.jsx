import React, { useState, useEffect } from "react";
import ChargeInfo from "./ChargeInfo";
import HouseholdInfoModal from "../Household/HouseholdInfoModal";

const ChargeDetailEdit = ({ charge, collections = [] }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCharge, setEditedCharge] = useState(charge);

  const [householdModalOpen, setHouseholdModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  // Cập nhật lại state khi prop charge thay đổi
  useEffect(() => {
    setEditedCharge(charge);
    setEditMode(false);
  }, [charge]);

  // Tự động điền loại khoản thu khi feeName thay đổi
  useEffect(() => {
    if (!editedCharge || !editedCharge.feeName) return;
    const found = collections.find(
      c => c.code === editedCharge.feeName || c.name === editedCharge.feeName
    );
    if (found) {
      setEditedCharge(prev => ({ ...prev, Type: found.type }));
    }
  }, [editedCharge.feeName, collections]);

  const handleChange = (e) => {
    setEditedCharge({ ...editedCharge, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      !editedCharge.feeName ||
      !editedCharge.amount ||
      !editedCharge.paidAt
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/contributions/${editedCharge.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            household: editedCharge.householdNumber,
            code: editedCharge.feeName,
            amount: parseInt(editedCharge.amount, 10),
            payment_date: editedCharge.paidAt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi cập nhật phiếu nộp");
      }

      setEditMode(false);
      alert("Đã lưu thông tin mới!");
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
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

  const handleDelete = async () => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa phiếu nộp này?")) {
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8000/contributions/${editedCharge.id}/delete/`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
      alert(data.message || "Đã xóa phiếu nộp!");
      window.location.reload();
    } else {
      alert(data.message || "Xóa phiếu nộp thất bại!");
    }
  } catch (err) {
    console.error("Error deleting charge:", err);
    alert("Lỗi khi xóa phiếu nộp!");
  }
};

  if (!editedCharge) return null;

  return (
    <div>
      <h2>Thông tin phiếu nộp</h2>
      {editMode ? (
        <div className="charge-info-edit">
          <div className="charge-info-grid">
            <div>
              <label>Tên khoản thu: </label>
              <input name="feeName" value={editedCharge.feeName} onChange={handleChange} />
            </div>
            <div>
              <label>Loại khoản thu: </label>
              <input name="Type" value={editedCharge.Type || ""} readOnly />
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