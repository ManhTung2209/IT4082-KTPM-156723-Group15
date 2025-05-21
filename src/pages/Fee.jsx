import React from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";

const Fee = () => {
  return (
    <div>
      <LeftBar activeMenu="fee" />
      <HeaderBar title="Khoản Thu" />
      <h2>Tổng quan</h2>
    </div>
  );
};

export default Fee