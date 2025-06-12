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

  const handleSave = async () => {
    if(!editedFee.code || !editedFee.name || !editedFee.type || !editedFee.amount || !editedFee.feeDate
    || !editedFee.feeEndDate){
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try{
      const token = localStorage.getItem('token');
      // const collection_id = localStorage.getItem('userId');
      const res = await fetch(`http://127.0.0.1:8000/collections/${editedFee.collection_id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code: editedFee.code,
          name: editedFee.name,
          type: editedFee.type,
          amount: editedFee.amount,
          feeDate: editedFee.feeDate || null,
          feeEndDate: editedFee.feeEndDate || null,
          description: editedFee.description,
        })
      });
      if(res.ok) {
        alert("Đã lưu thông tin mới!");
        setEditMode(false);
        if (typeof onSuccess === "function") onSuccess();
      } else {
        const data = await res.json();
        alert(data.detail || "Cập nhật khoản thu thất bại!");
      }
    } catch (errors) {
        alert("ERRORS " + errors.message);
        console.error("Error during registration:", errors);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khoản thu này?");
    if (confirmDelete) {
      try{
        const token = localStorage.getItem('token');
        const res = await fetch(`http://127.0.0.1:8000/collections/${editedFee.collection_id}/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if(res.ok) {
          alert("Đã xóa khoản thu!");
          if(typeof onSuccess === "function") onSuccess();
          navigate(-1); // Quay lại trang trước hoặc đóng modal
        } else {
          const data = await res.json();
          alert(data.detail || "Xóa khoản thu thất bại!");
        }
      } catch (errors) {
        alert("ERRORS " + errors.message);
        console.error("Error during registration:", errors);
      }
    // Gọi API hoặc logic xóa khoản thu ở đây
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
              <input name="code" value={editedFee.code} onChange={handleChange} />
            </div>
            <div>
              <label>Tên khoản thu: </label>
              <input name="name" value={editedFee.name} onChange={handleChange} />
            </div>
            <div>
              <label>Loại khoản thu: </label>
              <select name="type" value={editedFee.type} onChange={handleChange}>
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
              <input name="feeDate" type="date" value={editedFee.feeDate} onChange={handleChange} />
            </div>
            <div>
              <label>Ngày hết hạn: </label>
              <input name="feeEndDate" type="date" value={editedFee.feeEndDate} onChange={handleChange} />
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