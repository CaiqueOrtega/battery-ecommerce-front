import { useState } from "react";

const ErrorServices = () => {
    const [errorMessages, setErrorMessages] = useState({});

    const handleAPIError = (error) => {
        console.log('entrou')

        if (error?.response?.data?.field) {

            const { field, message } = error.response.data;
            
            setErrorMessages({ [field]: message });
            console.log('aquiii')
        } else if (error?.response?.data?.message) {
            setErrorMessages({ general: error.response.data.message });
            console.log(error.response.data.message)
        } else {
            setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
        }
    }
    
        return { errorMessages, setErrorMessages, handleAPIError } 
};

export default ErrorServices