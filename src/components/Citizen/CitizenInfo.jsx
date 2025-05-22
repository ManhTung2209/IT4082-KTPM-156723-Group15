import React from "react";
import "./CitizenInfo.css";

const CitizenInfo = ({ citizen }) => {
  if (!citizen) return <div>Không có dữ liệu cư dân.</div>;

  return (
    <div className="citizen-info">
      <div><strong>Họ tên:</strong> {citizen.name}</div>
      <div><strong>Tuổi:</strong> {citizen.age}</div>
      <div><strong>Địa chỉ:</strong> {citizen.address}</div>
      <div><strong>Căn hộ:</strong> {citizen.household}</div>
      <div><strong>Trạng thái:</strong> {citizen.status}</div>
      {/* Thêm các trường khác nếu cần */}
    </div>
  );
};

export default CitizenInfo;