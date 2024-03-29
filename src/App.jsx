import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import Login from './pages/login/LoginPage';
import SignUp from "./pages/signUp/SignUpPage";
import DashboardPage from "./pages/dashboard/DashboardPage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastrar" element={<SignUp />} /> 
        <Route path="/paineldecontrole" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
