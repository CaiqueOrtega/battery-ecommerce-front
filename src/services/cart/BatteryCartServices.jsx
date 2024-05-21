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
            console.log('error', error)
        }
    }

    const addBattery = async (id, batteryId, quantity) => {
        try{
            const response = await ConnectionAPI.put(`cart/${id}/battery/${batteryId}/quantity/${quantity}`)
            console.log(response.data)
            return response.data
        } catch (error){
            handleAPIError(error)
        }
    }

    return { getByUser, addBattery }
}

export default BatteryCartServices