import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";

const SaleServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const createCreditCardPayment = async (paymentCardValues) => {
        console.log(paymentCardValues)
        try {
            const response = await ConnectionAPI.post(`payment/card`, {
                fmc_description: 'pagamento via cartão de crédito',
                cardId: paymentCardValues.cardId,
                saleData: {
                    cep: paymentCardValues.cep,
                    freightValue: paymentCardValues.freightValue,
                    addressId: paymentCardValues.addressId,
                    userId: paymentCardValues.userId,
                    cartId: paymentCardValues.cartId
                }
            })
            return response.data
        }catch(error){
        }
    }

    const createPixPayment = async (paymentPixValues) => {
        try {
            const response = await ConnectionAPI.post(`payment/pix`, {
                fmp_description: 'pagamento via Pix',
                saleData: {
                    cep: paymentPixValues.cep,
                    addressId: paymentPixValues.addressId,
                    userId: paymentPixValues.userId,
                    cartId: paymentPixValues.cartId
                }
            })
            console.log(response.data)
            return response.data;
        }catch(error){
        }
    }

    const createTicketPayment = async (paymentTicketValues) => {
        try {
            const response = await ConnectionAPI.post(`payment/ticket`, {
                fmc_description: 'Pagamento via Boleto',
                saleData: {
                    cep: paymentTicketValues.cep,
                    addressId: paymentTicketValues.addressId,
                    userId: paymentTicketValues.userId,
                    cartId: paymentTicketValues.cartId
                }
            })
            return response.data;
        }catch(error){
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

    const getSaleReporData = async (report) => {
        try {
            const response = await ConnectionAPI.get(`sale/report/${report}`)
            return response.data
        } catch (e) {
            handleAPIError(e)
        }
    }

    return { createCreditCardPayment, createPixPayment, createTicketPayment, getAllSales, getSaleReporData, setErrorMessages, errorMessages }
}

export default SaleServices;