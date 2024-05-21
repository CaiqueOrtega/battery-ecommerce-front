import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import Settings from './pages/settings/SettingsPage';
import AuthenticationPage from './pages/authentication/AuthenticationPage';
import BatteryPurchasePage from './pages/batteryPurchase/BatteryPurchasePage';

import { AuthProvider } from './context/AuthProvider';
import { GlobalDataProvider } from './context/GlobalDataProvider';
import { DashBoardProvider } from './context/DashBoardProvider';
import { BatteryCartProvider } from './context/BatteryCartProvider';
import TermsAndConditions from './pages/terms/TermsAndConditions';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GlobalDataProvider><BatteryCartProvider><HomePage /></BatteryCartProvider></GlobalDataProvider>} />
          <Route path="/paineldecontrole" element={<DashBoardProvider><DashboardPage /> </DashBoardProvider>} />
          <Route path="/autenticacao/:action" element={<AuthenticationPage />} />
          <Route path='/bateria' element={<GlobalDataProvider><BatteryCartProvider><BatteryPurchasePage /></BatteryCartProvider></GlobalDataProvider>} />
          <Route path="/configuracoes" element={<BatteryCartProvider><Settings /></BatteryCartProvider>} />
          <Route path='/termos' element={<TermsAndConditions/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
