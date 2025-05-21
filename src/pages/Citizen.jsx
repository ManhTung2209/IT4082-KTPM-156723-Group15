import React from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";

const Citizen = () => {
  return (
    <div>
      <LeftBar activeMenu="citizen" />
      <HeaderBar title="Cư dân" />
      <h2>Tổng quan</h2>
    </div>
  );
};

export default Citizen