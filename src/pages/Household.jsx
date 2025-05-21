import React from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";

const HouseHold = () => {
  return (
    <div>
      <LeftBar activeMenu="household" />
      <HeaderBar title="Hộ khẩu" />
      <h2>Tổng quan</h2>
    </div>
  );
};

export default HouseHold