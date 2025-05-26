import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import './HomePage.css';
import { FaHome } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { LuWalletMinimal } from "react-icons/lu";
import { FaArrowTrendUp } from "react-icons/fa6";

const DashBoard = () => {
  // const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // const months = [
  //   "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  //   "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  // ];

  const stats = [
    {title: "Tổng số hộ khẩu", value: "... Hộ gia đình", icon: <FaHome/>, color: "#007bff"},
    {title: "Tổng số nhân khẩu", value: "... Cư dân", icon: <FaUserGroup/>, color: "#28a745"},
    {title: "Khoản thu hiện tại", value: "... Đang thu", icon: <LuWalletMinimal/>, color: "#ffc107" },
    {title: "Tổng thu tháng này", value: "... VND", icon: <FaArrowTrendUp/>, color: "#6f42c1" },
  ];

  const recentactivity = {
    title: "Hoạt động gần đây",
    items: [
      "5 hoạt động gần nhất trong hệ thống",
      "Thêm khoản thu mới",
      "Phí gửi ô tô - 50000"
    ],
    date: "25/05/2025",
  };

  const feeStatus = {
    title: "Tình hình thu phí",
    progress: 78,
    description: "Tỷ lệ phí trong tháng hiện tại",
    quantity: "96/124 hóa đơn",
  };
  return (
    <div>
      <LeftBar activeMenu="mainmenu"/>
      <HeaderBar title="Trang chủ"/>
      <div className="content-container">
        <h2 className="main-content">Tổng quan</h2>
        <div className="stat-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key = {index} style ={{borderColor: stat.color}}>
              <div className="stat-card-header">
                <span style={{color: stat.color, fontSize: 20}}>{stat.icon}</span>
                <h3>{stat.title}</h3>
              </div>
              <p>{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="details-section">
          <div className="activity-card">
            <h3>{recentactivity.title}</h3>
            <ul>
              {recentactivity.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="date">{recentactivity.date}</p>
          </div>
          
          <div className="fee-status-card">
            <h3>{feeStatus.title}</h3>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${feeStatus.progress}%`, backgroundColor: "#007bff" }}
              ></div>
            </div>
            <p>{feeStatus.progress}%</p>
            <p className="description">{feeStatus.description}</p>
            <p className="date">{feeStatus.quantity}</p>
          </div>
        </div>
      </div>
    </div>
   );
};

export default DashBoard