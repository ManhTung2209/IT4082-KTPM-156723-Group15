import React from 'react'
import './LeftBar.css'
import logo from '../../assets/bluemoonlogo.jpg'
import { FiLogOut, FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { LuChartColumn } from "react-icons/lu";
import { PiBuildingApartment } from "react-icons/pi";

const LeftBar = () => {
  return (
    <div className="leftbar-container">
    <nav>
      <div className="vertical-nav">
        <img src= {logo} alt = 'BlueMoon logo'/>
        <button className='mainmenubtn'><GoHome className='mainmenu-icon'/>Trang chủ</button>
        <button className='statisticbtn'><LuChartColumn className='statistic-icon'/>Thống kê</button>
        <button className='citizenbtn'><FiUsers className='citizen-icon'/>Cư dân</button>
        <button className='householdbtn'><PiBuildingApartment className='household-icon'/>Căn hộ</button>
        <button className='logoutbtn'><FiLogOut className='logout-icon'/>Đăng xuất</button>
      </div>
    </nav>
    </div>
  )
}

export default LeftBar
