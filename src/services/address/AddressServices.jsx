import ConnectionAPI from "../ConnectionAPI"
import ErrorServices from "../error/ErrorServices";
import ViaCepAPI from "../ViaCepAPI"

const AddressServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const createAddress = async (formAddressValues, user) => {
        try {
            const response = await ConnectionAPI.post('address', {
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

    const getFreight = async (cep) =>{
        try {
            console.log('AAA', cep)
            const response = await ConnectionAPI.get(`freight/${cep}`)
            console.log(response)
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

        const getAddress = async (cep) => {
            try {
                const response = await ViaCepAPI.get(`${cep}/json/`)
                console.log(response.data)
                return response.data
            } catch (error) {
                console.error('erro no cep')
            }
        }
    
 

    return { createAddress, getFreight, getAddress }

}

export default AddressServices