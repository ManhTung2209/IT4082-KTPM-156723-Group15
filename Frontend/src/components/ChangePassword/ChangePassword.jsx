import React, { useState } from 'react'
import './ChangePassword.css'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaLock } from "react-icons/fa"
import { SiLastpass } from "react-icons/si"

const ChangePassword = () => {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (username.trim() === '') {
      newErrors.username = 'Tên tài khoản phải có dạng user@domain';
    }
    if (oldPassword.length < 8) {
      newErrors.oldPassword = 'Mật khẩu cũ phải có ít nhất 8 ký tự';
    }
    if (newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }
    if (rePassword !== newPassword) {
      newErrors.rePassword = 'Mật khẩu nhập lại phải khớp với mật khẩu mới';
    }
    if (unitCode.trim() === '') {
      newErrors.unitCode = 'Mã đơn vị không được để trống';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
  try {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Lấy userId đã lưu khi đăng nhập
    const res = await fetch(`http://127.0.0.1:8000/users/${userId}/change-password/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        old_password: oldPassword,
        new_password: newPassword,
        re_password: rePassword,
        unit_code: unitCode,
      })
    });
    if(res.ok) {
      alert('Đổi mật khẩu thành công!');
      navigate('/login');
    } else{
      const data = await res.json();
      alert(data.detail || "Đổi mật khẩu thất bại!");
    }
  } catch (errors) {
    alert("ERRORS " + errors.message);
    console.error("Error during registration:", errors);
  }
}
  };

  return (
    <div>
      <div className="changepassword-container">
        <div className="changepassword-wrapper">
          <form onSubmit={handleSubmit}>
            <h1>Đổi mật khẩu</h1>
            <div className="changepassword-input-box">
              <input
                type="text"
                placeholder="Tên tài khoản"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <FaUser className='icon' />
              {errors.username && <div className="error">{errors.username}</div>}
            </div>
            <h6>Chú ý: Tên tài khoản phải có dạng user@domain</h6>
            <div className="changepassword-input-box">
              <input
                type="password"
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
              />
              <FaLock className='icon' />
              {errors.oldPassword && <div className="error">{errors.oldPassword}</div>}
            </div>
            <h6>Chú ý: Mật khẩu cũ phải có ít nhất 8 ký tự</h6>
            <div className="changepassword-input-box">
              <input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <FaLock className='icon' />
              {errors.newPassword && <div className="error">{errors.newPassword}</div>}
            </div>
            <h6>Chú ý: Mật khẩu mới phải có ít nhất 8 ký tự</h6>
            <div className="changepassword-input-box">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
                required
              />
              <FaLock className='icon' />
              {errors.rePassword && <div className="error">{errors.rePassword}</div>}
            </div>
            <h6>Chú ý: Mật khẩu nhập lại phải khớp với mật khẩu mới</h6>
            <div className="changepassword-input-box">
              <input
                type="text"
                placeholder="Mã đơn vị"
                value={unitCode}
                onChange={e => setUnitCode(e.target.value)}
                required
              />
              <SiLastpass className='icon' />
              {errors.unitCode && <div className="error">{errors.unitCode}</div>}
            </div>
            <h6>Chú ý: Nhập cả chữ và số VD:AA1234</h6>
            <button className='changepasswordbtn' type="submit">Đổi mật khẩu</button>
            <button
              type="button"
              style={{ marginTop: 10, background: "#888" }}
              onClick={() => navigate(-1)}
            >
              Thoát
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword