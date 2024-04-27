import { useState } from "react";

const ErrorServices = () => {
    const [errorMessages, setErrorMessages] = useState({});

    const handleAPIError = (error) => {

        if (error.response.data.field) {
            console.log("Joao2", error.response.data.field)

            const { field, message } = error.response.data;
            console.log("Joao 3", field, message)

            setErrorMessages({ [field]: message });
            
        } else if (error.response.data.message) {
            setErrorMessages({ general: error.response.data.message });
        } else {
            setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
        }
    }
    
    return { errorMessages, setErrorMessages, handleAPIError }
};

export default ErrorServices