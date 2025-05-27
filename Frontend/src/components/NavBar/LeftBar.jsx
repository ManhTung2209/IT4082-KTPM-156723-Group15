import React from 'react'

import './LeftBar.css'
import logo from '../../assets/bluemoonlogo.jpg'
import { FiLogOut, FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { PiBuildingApartment } from "react-icons/pi";
import { MdOutlineFeed } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

/**
 * @param {Object} props
 * @param {'mainmenu'|'fee'|'charge'|'citizen'|'household'} props.activeMenu
 */
const LeftBar = ({ activeMenu }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/users/logout/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
        alert("ERRORS " + e.message);
        console.error("Error during registration:", e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    navigate('/login');
  }
  return (
    <div className="leftbar-container">
      <nav>
        <div className="vertical-nav">
          <img src={logo} alt='BlueMoon logo' />
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button
              className={`mainmenubtn${activeMenu === 'mainmenu' ? ' active' : ''}`}
            >
              <GoHome className='mainmenu-icon' />Trang chủ 
            </button>
          </Link>
          <Link to="/fee" style={{ textDecoration: 'none' }}>
            <button
              className={`mainmenubtn${activeMenu === 'fee' ? ' active' : ''}`}
            >
              <MdOutlineFeed className='mainmenu-icon' />Khoản thu
            </button>
          </Link>
          <Link to="/charge" style={{ textDecoration: 'none' }}>
            <button
              className={`mainmenubtn${activeMenu === 'charge' ? ' active' : ''}`}
            >
              <MdOutlineFeed className='mainmenu-icon' />Thu Phí
            </button>
          </Link>
          <Link to="/citizen" style={{ textDecoration: 'none' }}>
            <button
              className={`citizenbtn${activeMenu === 'citizen' ? ' active' : ''}`}
            >
              <FiUsers className='citizen-icon' />Cư dân
            </button>
          </Link>
          <Link to="/household" style={{ textDecoration: 'none' }}>
          <button
            className={`householdbtn${activeMenu === 'household' ? ' active' : ''}`}
          >
            <PiBuildingApartment className='household-icon' />Hộ dân
          </button>
          </Link>
          <button className='logoutbtn' onClick={handleLogout}>
            <FiLogOut className='logout-icon' />Đăng xuất
          </button>
        </div>
      </nav>
    </div>
  )
}

export default LeftBar