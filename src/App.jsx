import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import ChangePassword from './components/ChangePassword/ChangePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Home from './pages/Home';
import './index.css';
import HomeButton from './components/Button/HomeButton';

function App() {
  return (
    <Router>
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1000
      }}>
        <HomeButton />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
export default App;