import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";

const CardServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const getAllCardByUser = async (userId) => {
        try{
            const response = await ConnectionAPI.get(`card/${userId}`)
            return response.data
        } catch (error){
            handleAPIError(error)
        }
    }

    const createCard = async (formValues, userId) => {
        try{
            const response = await ConnectionAPI.post('card', {
                cardNumber: formValues.cardNumber,
                cardOwner: formValues.cardOwner,
                expirationDate: formValues.expirationDate,
                cvv: formValues.cvv,
                userId: userId,
                main: formValues.main
            })
            return response.data
        } catch(error){
            handleAPIError(error)
        }
    }

    const updateCard = async (cardId, cardOwner, expirationDate) => {
        try{
            const response = await ConnectionAPI.put(`card/${cardId}`, {
                cardOwner: cardOwner,
                expirationDate: expirationDate
            })
            return response.data
        } catch (error){
            handleAPIError(error)
        }
    }

    const deleteCard = async (cardId) => {
        try{
            const response = await ConnectionAPI.delete(`card/${cardId}`)
            return response.data
        } catch (error){
            handleAPIError(error)
        }
    }

    const setMainCard = async (cardId) => {
        try{
            const response = await ConnectionAPI.put(`card/main/${cardId}`)
            return response.data
        } catch (error){
            handleAPIError(error)
        }
    }

    return {getAllCardByUser, createCard, updateCard, deleteCard, setMainCard, errorMessages, setErrorMessages}
}

export default CardServices