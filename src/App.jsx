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
import BatteryPurchasePage from './pages/batteryPurchase/BatteryPurchasePage';
import { CartProvider } from './context/CartProvider';

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BatteryProvider><CartProvider><HomePage /></CartProvider></BatteryProvider>} />
          <Route path="/paineldecontrole" element={
            <BatteryProvider>
                <DashBoardProvider>
                  <DashboardPage />
                </DashBoardProvider>
            </BatteryProvider>} />
            <Route path="/autenticacao/:action" element={<AuthenticationPage />} />
            <Route path='/bateria' element={<BatteryProvider><CartProvider><BatteryPurchasePage /></CartProvider></BatteryProvider>}/>
          <Route path="/configuracoes" element={<CartProvider><MyAccont /></CartProvider>} />
        </Routes>
      </AuthProvider>
    </Router >
  );
}

export default App;
