import ViaCepAPI from "../ViaCepAPI"


const CepServices = () => {
    const getAddress = async (cep) => {
        try {
            const response = await ViaCepAPI.get(`${cep}/json/`)
            console.log(response.data)
            return response.data
        } catch (error) {
            console.error('erro no cep')
        }
    }

    return { getAddress }
}

export default CepServices