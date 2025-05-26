import React from 'react'
import './HeaderBar.css'
import { IoIosSearch } from "react-icons/io";

const HeaderBar = ({ title }) => {
    return (
        <div className='headerbar-container'>
            <div className='headerbar-title'>
                <h2>{ title }</h2>
            </div>
            <div className='headerbar-search'>
                <input type="text" placeholder="Tìm kiếm..."/><IoIosSearch className='search-icon'/>
            </div>
        </div>
    )
}

export default HeaderBar