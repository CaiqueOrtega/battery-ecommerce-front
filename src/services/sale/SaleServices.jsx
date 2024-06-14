import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";

const SaleServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    //Função adicionada temporariamente, lembrar de excluir após integração com AgilePay
    const createSale = async (value, freightValue, addressId, userId, cartId, promotionId) => {
        try {
            const response = await ConnectionAPI.post('sale', {
                value: value,
                freightValue: freightValue,
                addressId: addressId,
                userId: userId,
                cartId: cartId,
                promotionId: promotionId
            })
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const getAllSales = async () => {
        try {
            const response = await ConnectionAPI.get(`sale`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    const getReportData = async (report) => {
        try {
            const response = await ConnectionAPI.get(`sale/report/${report}`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    return { createSale, getAllSales, getReportData, setErrorMessages, errorMessages }
}

export default SaleServices;