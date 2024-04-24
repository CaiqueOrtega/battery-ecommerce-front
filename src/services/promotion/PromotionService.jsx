import ConnectionAPI from "../ConnectionAPI";
import { useState } from "react";

const PromotionService = () => {
    const [errorMessages, setErrorMessages] = useState({});

    const handleAPIError = (error) => {
        if (error.response.data.field) {
            const { field, message } = error.response.data;
            setErrorMessages({ [field]: message });
        } else if (error.response.data.message) {
            setErrorMessages({ general: error.response.data.message });
        } else {
            setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
        }
    };


    const getPromotions = async () => {
        try {
            const response = await ConnectionAPI.get('promotion')
            return response.data
        } catch (error){
            console.error(error)
        }
    }

    const updatePromotion = async (promotionId, promotionCode, promotionExpirationDate, promotionPercentage) => {
        try{
            const response = await ConnectionAPI.patch(`promotion/${promotionId}`, {
                expirationDate: promotionExpirationDate,
                percentage: promotionPercentage,
                code: promotionCode
            })
            return response.status
        } catch (error){
            handleAPIError(error)
        }
    }

    const deletePromotion = async (promotionCode) => {
        try{
            const response = await ConnectionAPI.delete(`promotion/${promotionCode}`)
            return response.status
        } catch (error){
            console.error("erro aqui")
        }
    }

    const createPromotion = async (promotion) => {
        try{
            const response = await ConnectionAPI.post('promotion', {
                expirationDate: promotion.expirationDate,
                percentage: promotion.percentage,
                code: promotion.code
            })
            return {success: true};
        } catch(error){
            handleAPIError(error);
            return {success: false}
        }
    }

    const reactivePromotion = async (promotionId, promotionValues) => {
        console.log(promotionValues);
        try{
            const response = await ConnectionAPI.post(`promotion/reactive/${promotionId}`, {
                expirationDate: promotionValues.expirationDate,
                percentage: promotionValues.percentage,
                code: promotionValues.code
            })
            return response.status
        } catch (error){
            handleAPIError(error)
        }
    }

    return { getPromotions, setErrorMessages, errorMessages, updatePromotion, deletePromotion, createPromotion, reactivePromotion }
}

export default PromotionService