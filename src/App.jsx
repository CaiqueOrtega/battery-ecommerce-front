import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyAccont from './pages/settings/Settings';
import { AuthProvider } from './context/AuthProvider';
import { BatteryProvider } from './context/BatteryProvider';
import { DashBoardProvider } from './context/DashBoardProvider';
import AuthenticationPage from './pages/authentication/AuthenticationPage';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BatteryProvider><HomePage /></BatteryProvider>} />
          <Route path="/paineldecontrole" element={
            <BatteryProvider>
                <DashBoardProvider>
                  <DashboardPage />
                </DashBoardProvider>
            </BatteryProvider>} />
            <Route path="/autenticacao" element={<AuthenticationPage />} />
          <Route path="/configuracoes" element={<MyAccont />} />
        </Routes>
      </AuthProvider>
    </Router >
  );
}

export default App;
