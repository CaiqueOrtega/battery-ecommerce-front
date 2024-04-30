import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from "./pages/signUp/SignUpPage";
import DashboardPage from './pages/dashboard/DashboardPage';
import BatteryInfo from './pages/dashboard/battery/BatteryInfo';
import MyAccont from './pages/settings/Settings';
import { AuthProvider } from './context/AuthProvider';
import { BatteryProvider } from './context/BatteryProvider';
import { UserProvider } from './context/UsersProvider';
import { PromotionProvider } from './context/PromotionProvider';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BatteryProvider><HomePage /></BatteryProvider>} />
          <Route path="/paineldecontrole" element={
            <BatteryProvider>
              <UserProvider>
                <PromotionProvider>
                  <DashboardPage />
                </PromotionProvider>
              </UserProvider>
            </BatteryProvider>
          } />
          <Route path="/bateria" element={<BatteryProvider><BatteryInfo /></BatteryProvider>} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastrar" element={<SignUpPage />} />
          <Route path="/configuracoes" element={<MyAccont/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
