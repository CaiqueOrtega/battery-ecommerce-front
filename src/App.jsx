import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import BaseLayoutPage from './pages/StoreBaseLayout/BaseLayoutPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AuthenticationPage from './pages/authentication/AuthenticationPage';

import { AuthProvider } from './context/AuthProvider';
import { GlobalDataProvider } from './context/GlobalDataProvider';
import { DashBoardProvider } from './context/DashBoardProvider';
import TermsAndConditions from './pages/terms/TermsAndConditions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/:action?/:type?" element={
            <GlobalDataProvider>
                <BaseLayoutPage />
            </GlobalDataProvider>}
          />

          <Route path="/paineldecontrole" element={
            <DashBoardProvider>
              <DashboardPage />
            </DashBoardProvider>
          } />

          <Route path='/termos' element={<TermsAndConditions />}/>
          <Route path="/autenticacao/:action" element={<AuthenticationPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
