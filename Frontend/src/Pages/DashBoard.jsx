import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import './HomePage.css';
import { FaHome } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { LuWalletMinimal } from "react-icons/lu";

const DashBoard = () => {

  const [activities, setActivities] = useState([]);
  const [feeCount, setFeeCount] = useState("... Khoản thu");
  const [householdCount, setHouseholdCount] = useState("... Hộ gia đình");
  const [residentCount, setResidentCount] = useState("... Cư dân");
  const [feeList, setFeeList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
      fetch("http://localhost:8000/collections/", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setFeeList(data);
          else setFeeList([]);
      })
      .catch(() => setFeeList([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:8000/HouseHold_Resident/households/count/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
        }
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.count !== "undefined"){
          setHouseholdCount(`${data.count} Hộ gia đình`);
        } else {
          setHouseholdCount("0 hộ gia đình");
        }
      })
      .catch(() => setHouseholdCount("... Hộ gia đình"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:8000/HouseHold_Resident/citizens/count/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.count !== "undefined") {
          setResidentCount(`${data.count} Cư dân`);
        } else {
          setResidentCount("0 Cư dân");
        }
      })
      .catch(() => setResidentCount("... Cư dân"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:8000/collections/count/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.count !== "undefined") {
          setFeeCount(`${data.count} Khoản thu`);
        } else {
          setFeeCount("0 khoản thu");
        }
      })
      .catch(() => setFeeCount("... Khoản thu"));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("http://localhost:8000/activity/recent/", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(() => setActivities([]));
  }, []);

  const stats = [
    {title: "Tổng số hộ khẩu", value: householdCount, icon: <FaHome/>, color: "#007bff"},
    {title: "Tổng số nhân khẩu", value: residentCount, icon: <FaUserGroup/>, color: "#28a745"},
    {title: "Khoản thu hiện tại", value: feeCount, icon: <LuWalletMinimal/>, color: "#ffc107" },
    // {title: "Tổng thu tháng này", value: "... VND", icon: <FaArrowTrendUp/>, color: "#6f42c1" },
  ];

  // const feeStatus = {
  //   title: "Tình hình thu phí",
  //   progress: feeProgress.percent,
  // };
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
            <h3>5 Hoạt động gần đây</h3>
            <ul>
              {activities.length === 0 ? (
                <li>Không có hoạt động gần đây</li>
              ) : (
              activities.slice(0,5).map((item, index) => {
                let mainContent = "";
                if (item.content && item.action && item.content.startsWith(item.action)) {
                  mainContent = item.content.slice(item.action.length).trim();
                } else {
                  mainContent = item.content || "";
                }
                // Nếu có dấu ":" ở đầu, loại bỏ nó
                if (mainContent.startsWith(":")) {
                  mainContent = mainContent.slice(1).trim();
                }
                return (
                  <li key={index}>
                    <span>
                    <span style={{ fontWeight: "bold", fontSize: "0.9em" }}>
                      {item.action || "Hoạt động"}
                    </span>
                    <span style={{ fontSize: "0.9em", marginLeft: 4 }}>
                      {mainContent ? `: ${mainContent}` : ""}
                    </span>
                    </span>
                    <span style={{fontSize: "0.8em", color: "#888", display: "flex", whiteSpace: "nowrap"}}>
                      {item.date}
                    </span>
                  </li>
                );
              })
            )}
            </ul>
              {/* {activities.length} */}
          </div>
          
          <div className="fee-status-card">
            <h3>Tình hình thu phí</h3>
            <ul style={{ paddingLeft: 16}}>
              {feeList.length === 0 ? (
                <li>Không có khoản thu nào</li>
              ) : (
                feeList.map((fee, idx) => (
                  <li key={fee.collection_id || idx}>
                    <span style={{ fontWeight: 600}}>{fee.name}:</span>{" "}
                    Đến hạn vào ngày{" "}
                    <span style={{ fontWeight: 600}}>
                      {fee.feeEndDate
                      ? new Date(fee.feeEndDate).toLocaleDateString("vi-VN")
                      : "Chưa xác định"}
                    </span>
                  </li> 
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
   );
};

export default DashBoard