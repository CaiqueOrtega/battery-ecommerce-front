import React, { useContext, useState, useEffect }from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from "./pages/signUp/SignUpPage";
import DashboardPage from './pages/dashboard/DashboardPage';
import BatteryInfo from './pages/dashboard/battery/BatteryInfo';
import MyAccont from './pages/settings/Settings';
import { AuthProvider, AuthContext } from './context/AuthProvider';
import { BatteryProvider } from './context/BatteryProvider';
import { DashBoardProvider } from './context/DashBoardProvider';
import AuthServices from './services/auth/AuthServices';


function App() {

  const VerifyAuth = ({ children }) => {
    console.log('teste')
    const { userData, isContextLoaded, isLoggedIn } = useContext(AuthContext);
    const { userRoleAuthorization } = AuthServices();
    const [auth, setAuth] = useState(true);

    useEffect(() => {
      async function fetchData() {
        const response = await userRoleAuthorization(userData, true);

        if (response && response.success) {
          setAuth(false);
        }
      }
      fetchData();
    }, [userData, isContextLoaded, isLoggedIn]);

    return auth ? null : children;
  }


  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<BatteryProvider><HomePage /></BatteryProvider>} />
          <Route path="/paineldecontrole" element={
            <BatteryProvider>
              <VerifyAuth>
                <DashBoardProvider>
                  <DashboardPage />
                </DashBoardProvider>
              </VerifyAuth>
            </BatteryProvider>} />
          <Route path="/bateria" element={<BatteryProvider><BatteryInfo /></BatteryProvider>} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastrar" element={<SignUpPage />} />
          <Route path="/configuracoes" element={<MyAccont />} />
        </Routes>
      </AuthProvider>
    </Router >
  );
}

export default App;
