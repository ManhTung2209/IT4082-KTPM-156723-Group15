import React from 'react'
import './HeaderBar.css'
import { IoIosSearch } from "react-icons/io";

const HeaderBar = () => {
    return (
        <div className='headerbar-container'>
            <div className='headerbar-title'>
                <h2>Trang chủ</h2>
            </div>
            <div className='headerbar-search'>
                <input type="text" placeholder="Tìm kiếm..."/><IoIosSearch className='search-icon'/>
            </div>
        </div>
    )
}

export default HeaderBar