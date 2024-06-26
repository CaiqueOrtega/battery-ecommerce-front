import ConnectionAPI from "../ConnectionAPI";
import ErrorServices from "../error/ErrorServices"

const PromotionService = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();


    const getPromotions = async () => {
        try {
            const response = await ConnectionAPI.get('promotion')
            return response.data
        } catch (error) {
            console.error(error)
        }
    }

    const updatePromotion = async (promotionId, promotion) => {
        try {
            const response = await ConnectionAPI.patch(`promotion/${promotionId}`, {
                expirationDate: promotion.expirationDate,
                percentage: promotion.percentage,
                code: promotion.code
            })
            return { success: true };
        } catch (error) {
            handleAPIError(error)
        }
    }

    const deletePromotion = async (promotionCode) => {
        try {
            await ConnectionAPI.delete(`promotion/${promotionCode}`)
            return { success: true };
        } catch (error) {
            handleAPIError(error)
        }
    }

    const createPromotion = async (promotion) => {
        try {
           const response =  await ConnectionAPI.post('promotion', {
                expirationDate: promotion.expirationDate,
                percentage: promotion.percentage,
                code: promotion.code
            })
            return response.data;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const reactivePromotion = async (promotionId, promotionExpirationDate) => {
        try {
            const response = await ConnectionAPI.put(`promotion/reactive/${promotionId}`, {  
                expirationDate: promotionExpirationDate
             })
            return { success: true };
        } catch (error) {
            handleAPIError(error);
        }
    }

    const getPromotionReportData = async (report) => {
        try{
            const response = await ConnectionAPI.get(`promotion/report/${report}`)
            return response.data
        } catch (error){
            console.error(error)
        }
    }

    const getPromotionByCode = async (code) =>{
        try{
            const response = await ConnectionAPI.get(`promotion/${code}/code`)
            return response.data
        } catch (error){
            console.error(error)
        }
    }

    return { getPromotions, updatePromotion, deletePromotion, createPromotion, getPromotionReportData, reactivePromotion, getPromotionByCode, errorMessages, setErrorMessages }
}

export default PromotionService