import React from "react";
import { Link } from "react-router-dom";
import LeftBar from "../components/NavBar/LeftBar";
import HeaderBar from "../components/NavBar/HeaderBar";

const Toll = () => {
  return (
    <div>
      <LeftBar activeMenu="toll" />
      <HeaderBar title="Thu Phí" />
      <h2>Tổng quan</h2>
    </div>
  );
};

export default Toll