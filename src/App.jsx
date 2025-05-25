import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm/SignupForm';
import LoginForm from './components/LoginForm/LoginForm';
import ChangePassword from './components/ChangePassword/ChangePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Home from './Pages/Home';
import './index.css';
import DashBoard from './Pages/DashBoard';
import Citizen from './pages/Citizen';
import Household from './Pages/Household';
import Fee from './pages/Fee';  
import Toll from './pages/Toll';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashBoard />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/citizen" element={<Citizen />} />
        <Route path="/household" element={<Household />} />
        <Route path="/fee" element={<Fee />} />
        <Route path="/toll" element={<Toll />} />
        <Route path="/homepage" element={<DashBoard />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
export default App;