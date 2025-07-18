import React, { useState }  from 'react';
import './SignupForm.css';
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { SiLastpass } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
import { MdEmail } from "react-icons/md";

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState(''); 
  const [unitCode, setUnitCode] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors.username = 'Tên tài khoản phải có dạng user@domain';
    }
    if (username.trim() === '') {
      newErrors.username = 'Tên tài khoản không được để trống';
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
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:8000/users/register/", {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            username,
            email,
            role,
            unit_code: unitCode,
            password,
          })
        });
        if (res.ok) {
          alert('Đăng ký thành công!');
          navigate('/login');
        } else {
          const data = await res.json();
          alert(data.detail || "Đăng ký thất bại!");
        }
      } catch (errors) {
        alert("ERRORS " + errors.message);
        console.error("Error during registration:", errors);
      }
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Đăng ký</h1>
          <div className="signup-input-box">
            <input
              type = "email"
              placeholder='Email'
              value = {email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <MdEmail className='icon' />
            {errors.email && <div className='error'>{errors.email}</div>}
          </div>
          <h6>Chú ý: Email phải có dạng user@domain</h6>
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
            <h6>Chú ý: Tên tài khoản không được bỏ trống</h6>
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
          <div className="role-input-box">
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <option value="" disabled>Chọn vai trò</option>
              <option className='role-option' value="manager">Tổ trưởng</option>
              <option className='role-option' value="deputy">Tổ phó</option>
              <option className='role-option' value="accountant">Kế toán</option>
            </select>
            {errors.role && <div className="error">{errors.role}</div>}
          </div>
          <h6>Chú ý: Chọn đúng vai trò</h6>
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