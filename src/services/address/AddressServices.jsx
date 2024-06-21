import ConnectionAPI from "../ConnectionAPI"
import ErrorServices from "../error/ErrorServices";
import ViaCepAPI from "./viaCep/ViaCepAPI"

const AddressServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const createAddress = async (formAddressValues, userId) => {
        try {
            const response = await ConnectionAPI.post('address', {
                address: formAddressValues.address,
                number: formAddressValues.number,
                neighborhood: formAddressValues.neighborhood,
                complement: formAddressValues.complement,
                city: formAddressValues.city,
                state: formAddressValues.state,
                CEP: formAddressValues.cep,
                main: formAddressValues.main,
                userId: userId
            })
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const updateAddress = async (formUpdateAddressValues, addressId) => {
        try {
            const response = await ConnectionAPI.patch(`address/${addressId}`, {
                address: formUpdateAddressValues.address,
                number: formUpdateAddressValues.number,
                neighborhood: formUpdateAddressValues.neighborhood,
                complement: formUpdateAddressValues.complement,
                city: formUpdateAddressValues.city,
                state: formUpdateAddressValues.state,
                CEP: formUpdateAddressValues.cep,
                main: formUpdateAddressValues.main
            })

            return response.data;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const deleteAddress = async (addressId) => {
        try {
            const response = await ConnectionAPI.delete(`address/${addressId}`)
            return response.status;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const updateMainAddress = async (addressId) => {
        try {
            const response = await ConnectionAPI.patch(`address/main/${addressId}`)
            return response.data;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const getAddressByUserId = async (userId) => {
        try {
            const response = await ConnectionAPI.get(`address/user/${userId}`)
            return response.data;
        } catch (error) {
            handleAPIError(error)
        }
    }

    const getFreight = async (cep, quantity) => {
        try {
            const response = await ConnectionAPI.get(`freight/${cep}/${quantity}`)
            return response.data
        } catch (error) {
            handleAPIError(error)
        }
    }

    const getAddressCep = async (cep) => {
        try {
            const response = await ViaCepAPI.get(`${cep}/json/`)
            console.log(response.data)
            return {
                address: response.data.logradouro,
                cep: response.data.cep.replace('-', ''),
                city: response.data.localidade,
                complement: response.data.complemento,
                neighborhood: response.data.bairro,
                state: response.data.uf,
            }
        } catch (error) {
            return false
        }
    }



    return { createAddress, updateAddress, updateMainAddress, deleteAddress, getFreight, getAddressCep, getAddressByUserId, errorMessages, setErrorMessages }

}

export default AddressServices