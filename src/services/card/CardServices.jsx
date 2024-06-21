import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";

const CardServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const getAllCardByUser = async (userId) => {
        try {
            const response = await ConnectionAPI.get(`card/${userId}`)
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const createCard = async (formValues, userId) => {
        try {
            const response = await ConnectionAPI.post('card', {
                cardNumber: formValues.cardNumber,
                cardOwner: formValues.cardOwner,
                expirationDate: formValues.expirationDate,
                cvv: formValues.cvv,
                ownerDocument: formValues.ownerDocument,
                main: formValues.main,
                userId: userId
            })
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const updateCard = async (cardId, formCardValues) => {
        try {
            const response = await ConnectionAPI.put(`card/${cardId}`, {
                cardOwner: formCardValues.cardOwner,
                expirationDate: formCardValues.expirationDate
            })
            if (response.status === 200) {
                return response.data
            }
        } catch (error) {
            handleAPIError(error)
        }
    }

    const deleteCard = async (cardId) => {
        try {
            await ConnectionAPI.delete(`card/${cardId}`)
            return true;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const updateMainCard = async (cardId) => {
        try {
            const response = await ConnectionAPI.put(`card/main/${cardId}`)
            return response.status
        } catch (error) {
            handleAPIError(error)
        }
    }

    return { getAllCardByUser, createCard, updateCard, deleteCard, updateMainCard, errorMessages, setErrorMessages }
}

export default CardServices