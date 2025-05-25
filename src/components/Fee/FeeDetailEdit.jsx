import React, { useState, useEffect } from "react";
import FeeInfo from "./FeeInfo";
import { useNavigate } from "react-router-dom";

const FeeDetailEdit = ({ fee }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedFee, setEditedFee] = useState(fee);
  const navigate = useNavigate();

  // Cập nhật lại state khi prop fee thay đổi
  useEffect(() => {
    setEditedFee(fee);
    setEditMode(false); // Reset về chế độ xem khi mở modal mới
  }, [fee]);

  const handleChange = (e) => {
    setEditedFee({ ...editedFee, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Gọi API lưu thông tin mới ở đây
    setEditMode(false);
    alert("Đã lưu thông tin mới!");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khoản thu này?");
    if (confirmDelete) {
    // Gọi API hoặc logic xóa khoản thu ở đây
      alert("Đã xóa khoản thu!");
      navigate(-1); // Quay lại trang trước hoặc đóng modal
    }
  };

  if (!editedFee) return null; // Tránh lỗi khi chưa có dữ liệu

  return (
    <div>
      <h2>Thông tin khoản thu</h2>
      {editMode ? (
        <div className="fee-info-edit">
          <div className="fee-info-grid">
            <div>
              <label>Mã khoản thu: </label>
              <input name="idFee" value={editedFee.idFee} onChange={handleChange} />
            </div>
            <div>
              <label>Tên khoản thu: </label>
              <input name="feeName" value={editedFee.feeName} onChange={handleChange} />
            </div>
            <div>
              <label>Loại khoản thu: </label>
              <select name="feeType" value={editedFee.feeType} onChange={handleChange}>
                <option value="Bắt buộc">Bắt buộc</option>
                <option value="Tự nguyện">Tự nguyện</option>
              </select>
            </div>
            <div>
              <label>Số tiền: </label>
              <input name="amount" value={editedFee.amount} onChange={handleChange} />
            </div>
            <div>
              <label>Ngày tạo: </label>
              <input name="feeDate" value={editedFee.feeDate} onChange={handleChange} />
            </div>
            <div>
              <label>Ngày hết hạn: </label>
              <input name="feeEndDate" value={editedFee.feeEndDate} onChange={handleChange} />
            </div>
            <div>
              <label>Ghi chú: </label>
              <input name="description" value={editedFee.description} onChange={handleChange} />
            </div>
          </div> 
        </div>
      ) : (
        <FeeInfo fee={editedFee} />
      )}
      <div style={{ marginTop: 20 }}>
        {!editMode ? (
          <>
            <button className="personbtn" onClick={() => setEditMode(true)}>Sửa thông tin</button>
            <button className="personbtn" onClick={handleDelete}>Xóa</button>
          </>
        ) : (
          <button className="personbtn" onClick={handleSave}>Lưu thông tin</button>
        )}
      </div>
    </div>
  );
};

export default FeeDetailEdit;