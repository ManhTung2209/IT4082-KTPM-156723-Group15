import React, { useState, useEffect } from "react";
import ChargeInfo from "./ChargeInfo";
import { useNavigate } from "react-router-dom";
import HouseholdInfoModal from "../Household/HouseholdInfoModal";
import { mockHouseholds } from "../../pages/Household";

const ChargeDetailEdit = ({charge}) => {
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
      if(!editedCharge.id || !editedCharge.householdNumber || !editedCharge.owner
      || !editedCharge.feeName || !editedCharge.Type || !editedCharge.amount || !editedCharge.paidAt){
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }
    // Gọi API lưu thông tin mới ở đây
    setEditMode(false);
    alert("Đã lưu thông tin mới!");
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
        <div style={{marginTop:20}}>
            {!editMode ? (
            <>
            <button onClick={() => setEditMode(true)}>Sửa thông tin</button>
            <button
                style={{marginLeft: 12}}
                onClick={() => {
                    const household = mockHouseholds.find(h => String(h.householdNumber) === String(editedCharge.householdNumber));
                    setSelectedHousehold(household);
                    setHouseholdModalOpen(true);
                    }}
            >Xem thông tin hộ dân
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
            >Xóa phiếu nộp
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
  )
}

export default ChargeDetailEdit;