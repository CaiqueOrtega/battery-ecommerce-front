import ConnectionAPI from "../ConnectionAPI";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

const AuthServices = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const { handleLogin } = useContext(AuthContext);

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

    const userRoleAuthorization = async (userData) => {
        try {
            const response = await ConnectionAPI.get(`auth/${userData.email}`);
            return response.status;
        } catch (error) {
            console.error("Erro ao obter autorização do usuário:", error);
            throw error;
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


    return {
        errorMessages,
        setErrorMessages,
        login,
        signUp,
        verifyDataRegister,
        userRoleAuthorization,
    };
};

export default AuthServices;



export function VerifyAuth({ children, request }) {
    const { userRoleAuthorization } = AuthServices();
    const { userData } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                await userRoleAuthorization(userData);
            } catch (error) {
                console.error("Erro ao verificar autenticação:", error);
                if (request) {
                    navigate('/');
                    return;
                }
            }
        }
        fetchData();
    }, [userData, navigate, request]);

    return children;
};
