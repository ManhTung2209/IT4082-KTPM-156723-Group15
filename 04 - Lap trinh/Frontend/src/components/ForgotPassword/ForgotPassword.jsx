import React, { useState } from 'react'
import './ForgotPassword.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { SiLastpass } from "react-icons/si";

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [unitCode, setUnitCode] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if( username.trim() === '') {
            newErrors.username = 'Tên tài khoản phải có dạng user@domain';
        }
        if (newPassword.length < 8) {
            newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự';
        }
        if (rePassword !== newPassword) {
            newErrors.rePassword = 'Mật khẩu nhập lại phải khớp';
        }
        if (unitCode.trim() === '') {
            newErrors.unitCode = 'Mã đơn vị không được để trống';
        }

        setErrors(newErrors);

        if(Object.keys(newErrors).length === 0) {
    try {
        const res = await fetch("http://127.0.0.1:8000/users/forgot-password/", {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                username,
                unit_code: unitCode,
                new_password: newPassword
            })
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.detail || 'Đổi mật khẩu thành công!');
            navigate('/login');
        } else {
            alert(data.detail || "Đổi mật khẩu thất bại!");
        }
    } catch (errors) {
        alert("ERRORS " + errors.message);
        console.error("Error during forgot password:", errors);
    }
}
    };

    return (
        <div>
            <div className = "forgotpassword-container">
                <div className = "forgotpassword-wrapper">
                    <form onSubmit={handleSubmit}>
                        <h1>Quên mật khẩu</h1>
                        <div className="forgotpassword-input-box">
                            <input
                                type = "text"
                                placeholder = "Tên tài khoản"
                                value = {username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <FaUser className='icon' />
                            {errors.username && <div className="error">{errors.username}</div>}
                        </div>
                        <h6>Chú ý: Tên tài khoản phải có dạng user@domain</h6>
                        <div className="forgotpassword-input-box">
                            <input
                                type = "password"
                                placeholder='Mật khẩu mới'
                                value = {newPassword}
                                onChange = {e => setNewPassword(e.target.value)}
                                required
                            />
                            <FaLock className='icon'/>
                            {errors.newPassword && <div className="error">{errors.newPassword}</div>}
                        </div>
                        <h6>Chú ý: Mật khẩu phải có ít nhất 8 ký tự</h6>
                        <div className = "forgotpassword-input-box">
                            <input
                                type = "password"
                                placeholder='Nhập lại mật khẩu mới'
                                value = {rePassword}
                                onChange = {e => setRePassword(e.target.value)}
                                required
                            />
                            <FaLock className='icon'/>
                            {errors.rePassword && <div className="error">{errors.rePassword}</div>}
                        </div>
                        <h6>Chú ý: Mật khẩu nhập lại phải khớp</h6>
                        <div className="forgotpassword-input-box">
                            <input
                                type="text"
                                placeholder="Mã đơn vị"
                                value={unitCode}
                                onChange={e => setUnitCode(e.target.value)}
                                required
                            />
                            <SiLastpass className='icon'/>
                            {errors.unitCode && <div className="error">{errors.unitCode}</div>}
                        </div>
                        <h6>Chú ý: Nhập cả chữ và số VD:AA1234</h6>
                        <button type = "submit" className='forgotpass-btn'>Đổi mật khẩu</button>
                        <div className="login-link">
                            <p>Quay lại trang <Link to="/login">Đăng nhập</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword