import React, { useState, useEffect } from "react";
import CitizenInfo from "./CitizenInfo";
import { useNavigate } from "react-router-dom";
import HouseholdInfoModal from "../Household/HouseholdInfoModal";

const CitizenDetailEdit = ({ citizen, onCitizenUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCitizen, setEditedCitizen] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [householdModalOpen, setHouseholdModalOpen] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [householdInfo, setHouseholdInfo] = useState(null);

  // Update state when prop citizen changes
  useEffect(() => {
    if (citizen) {
      setEditedCitizen({
        ...citizen,
        birth_date: citizen.birth_date || (citizen.birthYear ? `${citizen.birthYear}-01-01` : ''),
      });
      setEditMode(false);
    }
  }, [citizen]);

  // Fetch household info for displaying room_number and block_name
  useEffect(() => {
    const fetchHousehold = async () => {
      if (!editedCitizen || !editedCitizen.household) {
        setHouseholdInfo(null);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/HouseHold_Resident/households/${editedCitizen.household}/`,
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
        setHouseholdInfo({
          ...data,
          householdNumber: data.household_id,
          owner: data.owner_name,
          block_name: data.block_name,
          room_number: data.room_number,
        });
      } catch (err) {
        setError(err.message);
        setHouseholdInfo(null);
      }
    };
    fetchHousehold();
  }, [editedCitizen && editedCitizen.household]);

  const handleChange = (e) => {
    setEditedCitizen({ ...editedCitizen, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (
      !editedCitizen ||
      !editedCitizen.name ||
      !editedCitizen.household ||
      !editedCitizen.gender ||
      !editedCitizen.birth_date ||
      !editedCitizen.hometown ||
      !editedCitizen.cccd ||
      !editedCitizen.cccdIssueDate ||
      !editedCitizen.cccdIssuePlace
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const apiStatus = editedCitizen.status === "Sinh sống" ? "sinh_song" :
        editedCitizen.status === "Tạm trú" ? "tam_tru" :
        editedCitizen.status === "Tạm vắng" ? "tam_vang" : editedCitizen.status.toLowerCase();

      const response = await fetch(`http://localhost:8000/HouseHold_Resident/citizens/${editedCitizen.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          full_name: editedCitizen.name,
          household: parseInt(editedCitizen.household, 10),
          gender: editedCitizen.gender === "Nam" ? "male" : "female",
          birth_date: editedCitizen.birth_date,
          birth_place: editedCitizen.hometown,
          origin_place: editedCitizen.hometown,
          id_card_number: editedCitizen.cccd,
          id_card_issue_date: editedCitizen.cccdIssueDate,
          id_card_issue_place: editedCitizen.cccdIssuePlace,
          status: apiStatus,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        setError('Unauthorized access. Please log in.');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update citizen');
      }

      const data = await response.json();
      const updatedCitizen = {
        id: data.citizen_id,
        name: data.full_name,
        household: data.household,
        gender: data.gender === 'male' ? 'Nam' : 'Nữ',
        birth_date: data.birth_date,
        birthYear: new Date(data.birth_date).getFullYear(),
        hometown: data.origin_place,
        cccd: data.id_card_number,
        cccdIssueDate: data.id_card_issue_date,
        cccdIssuePlace: data.id_card_issue_place,
        status: data.status === 'sinh_song' ? 'Sinh sống' :
          data.status === 'tam_tru' ? 'Tạm trú' :
            data.status === 'tam_vang' ? 'Tạm vắng' : data.status.charAt(0).toUpperCase() + data.status.slice(1),
      };

      setEditedCitizen(updatedCitizen);
      window.location.reload();
      if (onCitizenUpdated) {
        onCitizenUpdated(updatedCitizen);
      }

      setEditMode(false);
      alert(data.message || "Đã lưu thông tin mới!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/HouseHold_Resident/citizens/${editedCitizen.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        setError('Unauthorized access. Please log in.');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete citizen');
      }
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  // Lấy household thật từ API khi xem thông tin hộ dân
  const handleShowHousehold = async () => {
    if (!editedCitizen || !editedCitizen.household) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/households/${editedCitizen.household}/`,
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
        block_name: data.block_name,
        room_number: data.room_number,
      });
      setHouseholdModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!editedCitizen) return <div>Không có dữ liệu cư dân.</div>;

  return (
    <div>
      <h2>Thông tin cư dân</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {editMode ? (
        <div className="citizen-info-edit">
          <div className="info-grid">
            <div>
              <label>Họ tên: </label>
              <input name="name" value={editedCitizen.name} onChange={handleChange} />
            </div>
            <div>
              <label>Số phòng: </label>
              <input value={householdInfo?.room_number || ""} readOnly />
            </div>
            <div>
              <label>Tên tòa: </label>
              <input value={householdInfo?.block_name || ""} readOnly />
            </div>
            <div>
              <label>Giới tính: </label>
              <input name="gender" value={editedCitizen.gender} onChange={handleChange} />
            </div>
            <div>
              <label>Ngày sinh: </label>
              <input
                type="date"
                name="birth_date"
                value={editedCitizen.birth_date}
                onChange={handleChange}
              />
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
              <input
                type="date"
                name="cccdIssueDate"
                value={editedCitizen.cccdIssueDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Nơi cấp: </label>
              <input name="cccdIssuePlace" value={editedCitizen.cccdIssuePlace} onChange={handleChange} />
            </div>
            <div>
              <label>Trạng thái: </label>
              <select name="status" value={editedCitizen.status} onChange={handleChange}>
                <option value="sinh_song">Sinh sống</option>
                <option value="tam_tru">Tạm trú</option>
                <option value="tam_vang">Tạm vắng</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="citizen-info">
          <div className="info-grid">
            <div><strong>Họ tên:</strong> {editedCitizen.name}</div>
            <div><strong>Số phòng:</strong> {householdInfo?.room_number || ""}</div>
            <div><strong>Tên tòa:</strong> {householdInfo?.block_name || ""}</div>
            <div><strong>Giới tính:</strong> {editedCitizen.gender}</div>
            <div><strong>Ngày sinh:</strong> {editedCitizen.birth_date}</div>
            <div><strong>Quê quán:</strong> {editedCitizen.hometown}</div>
            <div><strong>Mã CCCD:</strong> {editedCitizen.cccd}</div>
            <div><strong>Ngày cấp:</strong> {editedCitizen.cccdIssueDate}</div>
            <div><strong>Nơi cấp:</strong> {editedCitizen.cccdIssuePlace}</div>
            <div>
              <strong>Trạng thái:</strong>{" "}
              {editedCitizen.status === "sinh_song"
                ? "Sinh sống"
                : editedCitizen.status === "tam_tru"
                ? "Tạm trú"
                : editedCitizen.status === "tam_vang"
                ? "Tạm vắng"
                : editedCitizen.status}
            </div>
          </div>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
  {!editMode ? (
    <>
      {localStorage.getItem("role") === "manager" && (
        <>
          <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
          <button
            style={{ marginLeft: 12 }}
            onClick={handleDelete}
          >
            Xóa cư dân
          </button>
        </>
      )}
      <button
        style={{ marginLeft: 12 }}
        onClick={handleShowHousehold}
      >
        Xem thông tin hộ dân
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