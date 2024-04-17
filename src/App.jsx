import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from "./pages/signUp/SignUpPage";
import DashboardPage from './pages/dashboard/DashboardPage';
import BatteryInfo from './pages/battery/BatteryInfo';
import  { AuthContext, AuthProvider }   from './context/AuthProvider';

function App() {

  return (
    <Router>
      <AuthProvider >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastrar" element={<SignUpPage />} />
          <Route path="/paineldecontrole" element={<DashboardPage />} />
          <Route path='/bateria' element={<BatteryInfo/>}/>
        </Routes>
      </AuthProvider>
    </Router >

  );
}

export default App;
