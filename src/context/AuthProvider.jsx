import { useEffect, createContext, useState } from "react";
import ConnectionAPI from "../services/ConnectionAPI";
import { decodeToken } from 'react-jwt';
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prevFormDataLogin, setPrevFormDataLogin] = useState({})
  const [errorMessages, setErrorMessages] = useState({});
  const [decodedTokenEmail, setDecodedTokenEmail] = useState('');

  const login = async (emailLogin, passwordLogin) => {
    if (JSON.stringify(prevFormDataLogin) === JSON.stringify({ email: emailLogin, password: passwordLogin }) && !errorMessages.severError) {
      setErrorMessages(prevErrors => ({ ...prevErrors, general: 'Os dados não foram alterados.' }));
      return;
    }
    setPrevFormDataLogin({ email: emailLogin, password: passwordLogin });

    try {
      const response = await ConnectionAPI.post('auth/login', {
        email: emailLogin,
        password: passwordLogin
      });

      localStorage.setItem('token', response.data.token);
      navigate("/");

    } catch (error) {
      if (error.response) {
        if (error.response.data.field) {
          const { field, message } = error.response.data;
          setErrorMessages({ [field]: message });
        } else {
          setErrorMessages({ general: error.response.data.message })
        }

      } else if (error.request) {
        setErrorMessages({ severError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
      }
    }
  };


  const getUser = async (email) => {
    try {
      const response = await ConnectionAPI.get(`users/email/ocaiqueortega@gmail.com`);
      console.log(response.data);
    } catch (error) {
      console.log('Erro ao pegar usuario');
    }
  }

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const decodedToken = decodeToken(token);
          const fuso = -3 * 60 * 60 * 1000;
          const dataToken = new Date(decodedToken.exp * 1000 + fuso);
          const dataHoje = new Date(new Date().getTime() + fuso);
  
          if (dataToken < dataHoje) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          } else {
            ConnectionAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
            const email = decodedToken.email;
            await getUser(email);
          }
        } catch (error) {
          console.log("Erro durante a leitura do token", error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
  
    checkToken();
  }, [token])


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, errorMessages, navigate }}>
      {children}
    </AuthContext.Provider>
  );

}
export default AuthProvider;




