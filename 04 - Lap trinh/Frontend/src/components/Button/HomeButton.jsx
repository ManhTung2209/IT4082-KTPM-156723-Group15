import React from 'react';
import { Link } from 'react-router-dom';

const HomeButton = () => (
  <Link
    to="/"
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      background: '#4a5cff',
      color: '#fff',
      borderRadius: '8px',
      textDecoration: 'none',
      fontWeight: 'bold',
      margin: '8px 0'
    }}
  >
    Trang chủ
  </Link>
);

export default HomeButton;