import ConnectionAPI from "../ConnectionAPI";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

const AuthServices = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const { handleLogin, userData } = useContext(AuthContext);
    const [hasExecuted, setHasExecuted] = useState(false);
    const [response, setResponse] = useState(null);


    const navigate = useNavigate();

    const login = async (emailLogin, passwordLogin) => {
        try {
            const response = await ConnectionAPI.post('auth/login', {
                email: emailLogin,
                password: passwordLogin
            });
            handleLogin(response.data.token);
        } catch (error) {
            handleAPIError(error, setErrorMessages);

        }
    };

    const userRoleAuthorization = async (userData, request) => {
        try {
            const response = await ConnectionAPI.get(`auth/${userData.email}`);
            return response.status;
        } catch (error) {
            if (request) {
            }
        }

    }

    const signUp = async (singUpData) => {
        try {

            const response = await ConnectionAPI.post('auth/register', {
                email: singUpData.email,
                password: singUpData.password,
                name: singUpData.name,
                document: singUpData.document,
                confirmPassword: singUpData.confirmPassword
            });

            return true;
        } catch (error) {
            handleAPIError(error, setErrorMessages);
        }
    };

    const verifyDataRegister = async (singUpFormData) => {
        try {
            await ConnectionAPI.post('auth/verify', {
                email: singUpFormData.email,
                name: singUpFormData.name,
                document: singUpFormData.document,
            });

            return true;
        } catch (error) {
            handleAPIError(error, setErrorMessages);
            return false;
        }
    };


    const handleAPIError = (error, setErrorMessages) => {
        if (error.response && error.response.data) {
            if (error.response.data.field) {
                const { field, message } = error.response.data;
                setErrorMessages({ [field]: message });
            } else if (error.response.data.message) {
                setErrorMessages({ general: error.response.data.message });
            }
        } else {
            setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
        }
    };


    const VerifyAuth = ({ children, request }) => {
        console.log('teste', request )
        useEffect(() => {
            if ( !hasExecuted) {
                async function fetchData() {
                    const response = await userRoleAuthorization(userData, request);
                    setResponse(response);
                    setHasExecuted(true);
                }
                fetchData();
            }
        }, [userData, request, hasExecuted]);

        return response ? children : null;
    }





    return {
        errorMessages,
        setErrorMessages,
        login,
        signUp,
        verifyDataRegister,
        userRoleAuthorization,
        VerifyAuth
    };
};

export default AuthServices;
