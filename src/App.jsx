import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import Settings from './pages/settings/SettingsPage';
import AuthenticationPage from './pages/authentication/AuthenticationPage';
import BatteryPurchasePage from './pages/batteryPurchase/BatteryPurchasePage';

import { AuthProvider } from './context/AuthProvider';
import { BatteryProvider } from './context/BatteryProvider';
import { DashBoardProvider } from './context/DashBoardProvider';
import { BatteryCartProvider } from './context/BatteryCartProvider';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={<HomePageWithProviders />}
          />
          <Route
            path="/paineldecontrole"
            element={<DashboardPageWithProviders />}
          />
          <Route
            path="/autenticacao/:action"
            element={<AuthenticationPage />}
          />
          <Route
            path="/bateria"
            element={<BatteryPurchasePageWithProviders />}
          />
          <Route
            path="/configuracoes"
            element={<SettingsWithProvider />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function HomePageWithProviders() {
  return (
    <BatteryProvider>
      <BatteryCartProvider>
        <HomePage />
      </BatteryCartProvider>
    </BatteryProvider>
  );
}

function DashboardPageWithProviders() {
  return (
    <BatteryProvider>
      <DashBoardProvider>
        <DashboardPage />
      </DashBoardProvider>
    </BatteryProvider>
  );
}

function BatteryPurchasePageWithProviders() {
  return (
    <BatteryProvider>
      <BatteryCartProvider>
        <BatteryPurchasePage />
      </BatteryCartProvider>
    </BatteryProvider>
  );
}

function SettingsWithProvider() {
  return (
    <BatteryCartProvider>
      <Settings />
    </BatteryCartProvider>
  );
}

export default App;
