import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'
const Home = () => {
  return (
    <div style={{
      background: '#fff',
      padding: '40px 32px',
      borderRadius: '16px',
      boxShadow: '0 0 16px rgba(0,0,0,0.15)',
      minWidth: 320,
      textAlign: 'center'
    }}>
      <h1>Chào mừng bạn đến với trang Home!</h1>
      <p>
        <Link to="/login" style={{ marginRight: 16 }}>Đăng nhập</Link>
        <Link to="/signup">Đăng ký</Link>
        <Link to="/change-password" style={{ marginLeft: 16 }}>Đổi mật khẩu</Link>
      </p>
    </div>
  )
}

export default Home