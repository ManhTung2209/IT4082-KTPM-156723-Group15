import React, { useState, useEffect } from "react";
import "./HouseholdInfo.css";
import CitizenTable from "../Citizen/CitizenTable";
import CitizenDetailEditModal from "../Citizen/CitizenDetailEditModal";
import CitizenAddModal from "../Citizen/CitizenAddModal";

const HouseholdInfo = ({ household }) => {
  const isManager = localStorage.getItem("role") === "manager";
  const [editMode, setEditMode] = useState(false);
  const [editedHousehold, setEditedHousehold] = useState(household);
  const [citizens, setCitizens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [citizenModalOpen, setCitizenModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch household info from API
  useEffect(() => {
    const fetchHousehold = async () => {
      if (!household || !household.household_id) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://127.0.0.1:8000/HouseHold_Resident/households/${household.household_id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch household');
        const data = await response.json();
        setEditedHousehold({
          ...data,
          householdNumber: data.household_id,
          owner: data.owner_name,
          block_name: data.block_name,
          room_number: data.room_number,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHousehold();
    setEditMode(false);
  }, [household]);

  // Fetch citizen data from API
  useEffect(() => {
    const fetchCitizens = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/HouseHold_Resident/citizens/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch citizens');
        }

        const data = await response.json();
        // Map API data to match the expected citizen structure
        const mappedCitizens = data.map(citizen => ({
          id: citizen.citizen_id,
          name: citizen.full_name,
          household: citizen.household,
          gender: citizen.gender === 'male' ? 'Nam' : 'Nữ',
          birthYear: new Date(citizen.birth_date).getFullYear(),
          hometown: citizen.origin_place,
          cccd: citizen.id_card_number,
          cccdIssueDate: citizen.id_card_issue_date,
          cccdIssuePlace: citizen.id_card_issue_place,
          status: citizen.status === 'sinh_song' ? 'Sinh sống'
                : citizen.status === 'tam_tru' ? 'Tạm trú'
                : citizen.status === 'tam_vang' ? 'Tạm vắng'
                : citizen.status,
        }));

        setCitizens(mappedCitizens);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCitizens();
  }, []);

  if (!editedHousehold) return <div>Không có dữ liệu căn hộ.</div>;

  const handleChange = (e) => {
    setEditedHousehold({ ...editedHousehold, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editedHousehold.owner || !editedHousehold.block_name || !editedHousehold.room_number) {
      alert("Vui lòng nhập đầy đủ tên chủ hộ, tên tòa và số phòng");
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://127.0.0.1:8000/HouseHold_Resident/households/${editedHousehold.householdNumber}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            block_name: editedHousehold.block_name,
            room_number: editedHousehold.room_number,
            owner_name: editedHousehold.owner,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Cập nhật hộ dân thất bại!");
      }
      alert("Đã lưu thông tin hộ dân!");
      setEditMode(false);
      window.location.reload(); 
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter citizens belonging to this household
  const citizensInHousehold = citizens.filter(
    c => String(c.household) === String(editedHousehold.householdNumber)
  );

  // Count residents living in the household (Sinh sống or Tạm trú)
  const livingCount = citizensInHousehold.filter(
    c => c.status === "Sinh sống" || c.status === "Tạm trú"
  ).length;

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
              <label>Tên tòa: </label>
              <input name="block_name" value={editedHousehold.block_name || ""} onChange={handleChange} />
            </div>
            <div>
              <label>Số phòng: </label>
              <input name="room_number" value={editedHousehold.room_number || ""} onChange={handleChange} />
            </div>
            <div>
              <label>Chủ hộ: </label>
              <input name="owner" value={editedHousehold.owner || ""} onChange={handleChange} />
            </div>
          </div>
        ) : (
          <>
            <div><strong>Tên tòa:</strong> {editedHousehold.block_name}</div>
            <div><strong>Số phòng:</strong> {editedHousehold.room_number}</div>
            <div><strong>Chủ hộ:</strong> {editedHousehold.owner}</div>
            <div><strong>Số dân cư đang cư trú:</strong> {livingCount}</div>
          </>
        )}
        <div style={{ marginTop: 20 }}>
          {!editMode ? (
            isManager && (
              <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
            )
          ) : (
            <button onClick={handleSave}>Lưu thông tin</button>
          )}
        </div>
        <div className="citizen-list">
          <h3>Danh sách cư dân thuộc hộ dân này</h3>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <>
              <CitizenTable
                citizens={citizensInHousehold}
                onRowClick={handleRowClick}
              />
              {isManager && (
                <button
                  style={{ marginBottom: 12 }}
                  onClick={() => setAddModalOpen(true)}
                >
                  Thêm cư dân
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <CitizenDetailEditModal
        open={citizenModalOpen}
        onClose={() => setCitizenModalOpen(false)}
        citizen={selectedCitizen}
      />
      <CitizenAddModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        householdNumber={editedHousehold.householdNumber}
      />
    </div>
  );
};

export default HouseholdInfo;