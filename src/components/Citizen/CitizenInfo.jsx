import React from "react";
import "./CitizenInfo.css";

const CitizenInfo = ({ citizen }) => {
  if (!citizen) return <div>Không có dữ liệu cư dân.</div>;

  return (
    <div className="citizen-info">
      <div className="info-grid">
        <div><strong>Họ tên:</strong> {citizen.name}</div>
        <div><strong>Số phòng:</strong> {citizen.household}</div>
        <div><strong>Giới tính:</strong> {citizen.gender}</div>
       <div><strong>Ngày cấp:</strong> {citizen.cccdIssueDate}</div>
        <div><strong>Quê quán:</strong> {citizen.hometown}</div>
        <div><strong>Mã CCCD:</strong> {citizen.cccd}</div>
         <div><strong>Năm sinh:</strong> {citizen.birthYear}</div>
        <div><strong>Nơi cấp:</strong> {citizen.cccdIssuePlace}</div>
        <div><strong>Trạng thái:</strong> {citizen.status}</div>
      </div>
    </div>
  );
};

export default CitizenInfo;