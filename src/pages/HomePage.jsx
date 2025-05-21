import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";
import './HomePage.css';

const HomePage = () => {
  return (
    <div>
        <LeftBar activeMenu="mainmenu"/>
        <HeaderBar title="Trang chủ" />
        <h2>Tổng quan</h2>
    </div>
   )
}

export default HomePage
