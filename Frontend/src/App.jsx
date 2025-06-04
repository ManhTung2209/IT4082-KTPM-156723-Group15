import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import ChangePassword from './components/ChangePassword/ChangePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Home from './Pages/Home';
import './index.css';
import DashBoard from './Pages/DashBoard';
import Citizen from './pages/Citizen';
import Household from './pages/Household';
import Fee from './pages/Fee';  
import Charge from './Pages/Charge';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/citizen" element={<Citizen />} />
        <Route path="/household" element={<Household />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/charge" element={<Charge />} />
        <Route path="/homepage" element={<DashBoard />} />
        <Route path="*" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}
export default App;