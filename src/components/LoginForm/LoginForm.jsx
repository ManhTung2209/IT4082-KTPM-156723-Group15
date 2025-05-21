import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('rememberMe'));
    if (saved) {
      setUsername(saved.username);
      setPassword(saved.password);
      setRemember(true);
    }
  }, []);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(username)) {
      setError('Tài khoản phải có dạng user@domain');
      return;
    }
    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    setError('');
    alert('Đăng nhập thành công!');
    if (remember) {
      localStorage.setItem('rememberMe', JSON.stringify({ username, password }));
    } else {
      localStorage.removeItem('rememberMe');
    }
    navigate('/');
  };

  return (
    <div className='container'>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <h1>Đăng nhập</h1>
          <div className='input-box'>
            <input
              type="text"
              placeholder='Tên tài khoản'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <FaUser className='icon' />
          </div>
          <div className='input-box'>
            <input
              type="password"
              placeholder='Mật khẩu'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <FaLock className='icon'/>
          </div>

          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

          <div className='remember'>
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              Ghi nhớ tôi
            </label>
            <Link to="/forgot-password">Quên mật khẩu</Link>
          </div>
      
          <button type="submit">Đăng nhập</button>
      
          <div className="register-link">
            <p>Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm