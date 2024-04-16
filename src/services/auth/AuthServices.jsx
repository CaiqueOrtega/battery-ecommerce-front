import ConnectionAPI from "../ConnectionAPI";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthServices = () => {
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate();

    const login = async (emailLogin, passwordLogin) => {
        try {
            const response = await ConnectionAPI.post('auth/login', {
                email: emailLogin,
                password: passwordLogin
            });

            localStorage.setItem('token', response.data.token);
            navigate("/");
            window.location.reload()

        } catch (error) {
            handleAPIError(error, setErrorMessages);

        }
    };

    const userRoleAuhtorization = async (userEmail) => {
        try {
            const response = await ConnectionAPI.get(`auth/${userEmail}`);
            console.log('NAO DEU ERRO')
        } catch (error) {
            console.log('DEU ERRO');
            navigate('/');
        }

    }

    const signUp = async (emailSignUp, nameSignUp, documentSignUp, passwordSignUp, confirmPassword) => {
        try {

            const response = await ConnectionAPI.post('auth/register', {
                email: emailSignUp,
                password: passwordSignUp,
                name: nameSignUp,
                document: documentSignUp,
                confirmPassword: confirmPassword
            });

            navigate("/entrar", { state: { email: emailSignUp } });
        } catch (error) {
            handleAPIError(error, setErrorMessages);
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

    return { errorMessages, setErrorMessages, login, signUp, userRoleAuhtorization};
};

export default AuthServices;
