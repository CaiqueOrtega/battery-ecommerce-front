import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";


const BatteryCartServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const getByUser = async (userId) => {
        try {
            const response = await ConnectionAPI.get(`cart/user/${userId}`)
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const addBattery = async (userId, batteryId, quantity) => {
        try {
            const response = await ConnectionAPI.put(`cart/${userId}/battery/${batteryId}/quantity/${quantity}`)
            return response.data
        } catch (error) {
            console.log('entoru')
            handleAPIError(error)
        }
    }

    const removeBattery = async (userId, batteryId) => {
        try {
           const response =  await ConnectionAPI.delete(`cart/${userId}/battery/${batteryId}`)
            return response.data;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const  changeBatteryQuantity = async (cartId, cartBatteryId, quantity) => {
        try {
            const response = await ConnectionAPI.put(`cart/quantity/${cartId}/${cartBatteryId}/${quantity}`)
            return response.data;
        } catch (error) {
            return false;
        }
    }

    const removePromotion = async (cartId) => {
        try{
            const response = await ConnectionAPI.delete(`cart/${cartId}/promotion`)
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const addPromotion = async (cartId, promotionCode) => {
        try{
            const response = await ConnectionAPI.put(`cart/${cartId}/promotion/${promotionCode}`)
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }


    return { getByUser, addBattery, removeBattery, changeBatteryQuantity, errorMessages, setErrorMessages, removePromotion, addPromotion }
}

export default BatteryCartServices