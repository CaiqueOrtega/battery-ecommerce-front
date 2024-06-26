import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";

const DeliveryServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const getAllDeliveries = async () => {
        try {
            const response = await ConnectionAPI.get('delivery')
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    const getAllDeliveriesByUser = async (userId) => {
        try {
            const response = await ConnectionAPI.get(`delivery/user/${userId}`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    const getDeliveryReportData = async (report) => {
        try {
            const response = await ConnectionAPI.get(`delivery/report/${report}`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    const updateTrackingCode = async (deliveryId, code) => {
        try {
            const response = await ConnectionAPI.put(`delivery/${deliveryId}/code/${code}`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }
    
    const updateStatus = async (deliveryId, status) => {
        try {
            const response = await ConnectionAPI.put(`delivery/${deliveryId}/status/${status}`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    return { getAllDeliveries, getAllDeliveriesByUser, getDeliveryReportData, updateTrackingCode, updateStatus, errorMessages, setErrorMessages }
}

export default DeliveryServices;