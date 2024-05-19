import ConnectionAPI from "../ConnectionAPI"
import ErrorServices from "../error/ErrorServices";

const AddressServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const createAddress = async (formAddressValues, user) => {
        try {
            const response = await ConnectionAPI.post('/address', {
                address: formAddressValues.address,
                number: formAddressValues.number,
                neighborhood: formAddressValues.neighborhood,
                complement: formAddressValues.complement,
                city: formAddressValues.city,
                state: formAddressValues.state,
                CEP: formAddressValues.CEP,
                userId: user
            })
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    return { createAddress }
}

export default AddressServices