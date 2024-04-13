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

        } catch (error) {
            handleAPIError(error, setErrorMessages);

        }
    };

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

    const handleAPIError = (error) => {
        if (error.response.data.field) {
            const { field, message } = error.response.data;
            setErrorMessages({ [field]: message });
        } else if (error.request) {
            setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
        }else{
            setErrorMessages(error.response.data.message);
        }
    };

    return { errorMessages, setErrorMessages, login, signUp };
};

export default AuthServices;
