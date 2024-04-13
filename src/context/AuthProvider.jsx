import { useEffect, createContext, useState } from "react";
import ConnectionAPI from "../services/ConnectionAPI";
import { decodeToken } from 'react-jwt';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decodedTokenEmail, setDecodedTokenEmail] = useState('');
  const navigate = useNavigate();

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
          } else {
            setDecodedTokenEmail(decodedToken.sub);
            ConnectionAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
            console.log('JOAO')
          }
        } catch (error) {
          console.log("Erro durante a leitura do token", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };


      checkToken();

  }, [ token ])

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  }


  return (
    <AuthContext.Provider value={{ isLoggedIn, navigate}}>
      {children}
    </AuthContext.Provider>
  );

}
export { AuthContext, AuthProvider };



