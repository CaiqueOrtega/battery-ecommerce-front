import { useEffect, createContext, useState } from "react";
import ConnectionAPI from "../services/ConnectionAPI";
import { decodeToken } from 'react-jwt';
import { useNavigate } from "react-router-dom";
import UserService from "../services/users/UsersServices";

const AuthContext = createContext({});

function AuthProvider({ children }) {

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);
  const [decodedTokenEmail, setDecodedTokenEmail] = useState('');
  const navigate = useNavigate();
  const { getUserByEmail } = UserService();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const checkToken = async () => {

      if (token) {
        try {
          const decodedToken = decodeToken(token);
          const fuso = -3 * 60 * 60 * 1000;
          const dataToken = new Date(decodedToken.exp * 1000 + fuso);
          const dataHoje = new Date(new Date().getTime() + fuso);

          if (dataToken < dataHoje) {
            logout();
            setIsContextLoaded(true);
          } else {
            setDecodedTokenEmail(decodedToken.sub);
            ConnectionAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
        
            const user = await getUserByEmail(decodedToken.sub);
            setUserData(user);
            setIsContextLoaded(true);
          }
        } catch (error) {
          console.log("Erro durante a leitura do token", error);
        }
      } else {
        setUserData(null);
        console.log(" Erro ao chegar o token")
        setIsLoggedIn(false);
        setIsContextLoaded(true);
      }
    };


    checkToken();

  }, [ token ])



  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserData(null);
    setToken('');
  }


  return (
    <AuthContext.Provider value={{ isLoggedIn, navigate, userData, logout, isContextLoaded }}>
      {children}
    </AuthContext.Provider>
  );

}
export { AuthContext, AuthProvider };



