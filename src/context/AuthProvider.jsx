import { useEffect, createContext, useState, useContext } from "react";
import ConnectionAPI from "../services/ConnectionAPI";
import { decodeToken } from 'react-jwt';
import { useNavigate } from "react-router-dom";
import UserService from "../services/users/UsersServices";
import AuthServices from "../services/auth/AuthServices";

const AuthContext = createContext({});

function AuthProvider({ children }) {

  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isContextLoaded, setIsContextLoaded] = useState(false);

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
          } else {
            ConnectionAPI.defaults.headers['Authorization'] = `Bearer ${token}`;
            const user = await getUserByEmail(decodedToken.sub);
            if (user.status !== 'INACTIVE') {
              const initials = fetchInitials(user.name);
              const updatedUser = { ...user, initials: initials };

              setUserData(updatedUser);
              setIsLoggedIn(true);
            }
          }
        } catch (error) {
          console.log("Erro durante a leitura do token", error);
        }
      } else {
        setUserData(null);
        console.log(" Erro ao chegar o token", token)
        setIsLoggedIn(false);

      }
      setIsContextLoaded(true);
    };
    checkToken();


  }, [token])


  const logout = () => {
    try {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserData(null);
      setToken('');
      return true;
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return false;
    }
  }

  const handleLogin = (generatedToken) => {
    setToken(generatedToken);
    localStorage.setItem('token', generatedToken);
    navigate('/');
  }


  function VerifyAuth ({ children, request }) {
    const { userRoleAuthorization } = AuthServices();
    const [response, setResponse] = useState(null);

    useEffect(() => {
      if (isContextLoaded) {
        async function fetchData() {
          const response = await userRoleAuthorization(userData, request);
          setResponse(response);
        }
        fetchData();
      }
    }, [userData, isContextLoaded, isLoggedIn]);


    return response ? children : null;
  }



  const fetchInitials = (userDataName) => {
    let initials = '';
    if (userDataName) {
      const names = userDataName.split(' ');
      if (names.length >= 2) {
        initials = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
      } else if (names.length === 1) {
        initials = names[0].slice(0, 2).toUpperCase();
      }
    }
    return initials;
  }

  useEffect(() => {
    if (!isLoggedIn && isContextLoaded) {
      navigate('/');
    }
  }, [isLoggedIn, token]);

  return isContextLoaded ? (
    <AuthContext.Provider value={{ isLoggedIn, navigate, userData, logout, handleLogin, VerifyAuth }}>
      {children}
    </AuthContext.Provider>
  ) : null;

}
export { AuthContext, AuthProvider };

export const useAuthProvider = () => useContext(AuthContext);
