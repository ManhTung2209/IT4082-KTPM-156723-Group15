import React, { useState }  from 'react';
import './SignupForm.css';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { SiLastpass } from "react-icons/si";

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [unitCode, setUnitCode] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(username)) {
      newErrors.username = 'Tên tài khoản phải có dạng user@domain';
    }
    if (password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (rePassword !== password) {
      newErrors.rePassword = 'Mật khẩu nhập lại không khớp';
    }
    if (unitCode.trim() === '') {
      newErrors.unitCode = 'Mã đơn vị không được để trống';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('Đăng ký thành công!');
      // Xử lý đăng ký ở đây
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Đăng ký</h1>
          <div className="signup-input-box">
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
          <div className="signup-input-box">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <FaLock className='icon'/>
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
            <h6>Chú ý: Mật khẩu phải có ít nhất 8 ký tự</h6>
          <div className="signup-input-box">
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={rePassword}
              onChange={e => setRePassword(e.target.value)}
              required
            />
            <FaLock className='icon'/>
            {errors.rePassword && <div className="error">{errors.rePassword}</div>}
          </div>
            <h6>Chú ý: Mật khẩu nhập lại phải khớp</h6>
          <div className="signup-input-box">
            <input
              type="password"
              placeholder="Mã đơn vị"
              value={unitCode}
              onChange={e => setUnitCode(e.target.value)}
              required
            />
            <SiLastpass className='icon'/>
            {errors.unitCode && <div className="error">{errors.unitCode}</div>}
          </div>
            <h6>Chú ý: Nhập cả chữ và số VD:AA1234</h6>
          <button type="submit">Đăng ký</button>
          <div className="login-link">
            <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;