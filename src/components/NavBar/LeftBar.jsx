import React from 'react'
import './LeftBar.css'
import logo from '../../assets/bluemoonlogo.jpg'
import { FiLogOut, FiUsers } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { PiBuildingApartment } from "react-icons/pi";
import { Link } from 'react-router-dom';

/**
 * @param {Object} props
 * @param {'mainmenu'|'fee'|'toll'|'citizen'|'household'} props.activeMenu
 */
const LeftBar = ({ activeMenu }) => {
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
              <GoHome className='mainmenu-icon' />Khoản thu
            </button>
          </Link>
          <Link to="/toll" style={{ textDecoration: 'none' }}>
            <button
              className={`mainmenubtn${activeMenu === 'toll' ? ' active' : ''}`}
            >
              <GoHome className='mainmenu-icon' />Thu Phí
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
            <PiBuildingApartment className='household-icon' />Hộ khẩu
          </button>
          </Link>
          <button className='logoutbtn'>
            <FiLogOut className='logout-icon' />Đăng xuất
          </button>
        </div>
      </nav>
    </div>
  )
}

export default LeftBar