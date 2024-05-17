import ErrorServices from "../error/ErrorServices";
import ConnectionAPI from "../ConnectionAPI";

const CartServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const getByUser = async (userId) => {
        try {
            const response = await ConnectionAPI.get(`cart/user/${userId}`)
            console.log('carrinho', response.data)
            return response.data
        } catch (error) {
            console.log('EITA PORRA', error)
            handleAPIError(error)
        }
    }

    return { getByUser }
}

export default CartServices