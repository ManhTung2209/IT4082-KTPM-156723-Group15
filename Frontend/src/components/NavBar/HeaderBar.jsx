import React from 'react'
import './HeaderBar.css'
import { useNavigate } from 'react-router-dom';
import { GrUserManager } from "react-icons/gr"; // manager
import { FaUserEdit } from "react-icons/fa"; // editor
import { FaRegUser } from "react-icons/fa6";

const HeaderBar = ({ title }) => {
    const navigate = useNavigate();
    const handleChangePassword = () => {
        navigate('/change-password');
    };
    return (
        <div className='headerbar-container'>
            <div className='headerbar-title'>
                <h2>{ title }</h2>
            </div>
            <div className='headerbar-action'>
                <button className='changepass-btn' onClick={handleChangePassword}>Đổi mật khẩu</button>
                <span><FaUserEdit className='headerbar-icon'/></span>
            </div>
            {/* <div className='headerbar-search'>
                <input type="text" placeholder="Tìm kiếm..."/><IoIosSearch className='search-icon'/>
            </div> */}
        </div>
    )
}

export default HeaderBar;