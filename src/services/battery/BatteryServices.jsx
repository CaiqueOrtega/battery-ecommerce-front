import ConnectionAPI from "../ConnectionAPI";
import ErrorServices from "../error/ErrorServices";

const BatteryServices = () => {
    const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();

    const getBatteriesAll = async () => {
        try {
            const response = await ConnectionAPI.get('battery/all')
            return response.data
        } catch (error) {
        }
    }


    const getBatteriesActive = async () => {
        try {
            const response = await ConnectionAPI.get('battery')
            return response.data
        } catch (error) {
        }
    }


    

    const createBattery = async (batteryValues) => {
        try {
            const response = await ConnectionAPI.post('battery', {
                name: batteryValues.name,
                description: batteryValues.description,
                value: batteryValues.value,
                quantity: batteryValues.quantity,
                code: batteryValues.code
            });
            return response.data;
        } catch (error) {
            handleAPIError(error);
        }
    }

    const updateBattery = async (batteryId, batteryValues) => {
        try {
            await ConnectionAPI.patch(`battery/${batteryId}`, {
                name: batteryValues.name,
                description: batteryValues.description,
                value: batteryValues.value,
                quantity: batteryValues.quantity,
                code: batteryValues.code
            }
            )
            return  true;
        } catch (error) {
            handleAPIError(error);
        }
    }

    const deleteBattery = async (batteryId) => {
        try {
            await ConnectionAPI.delete(`battery/${batteryId}`)

            return { success: true }
        } catch (error) {
            handleAPIError(error);
        }
    }

    const reactiveBattery = async (batteryId) => {
        try {
            await ConnectionAPI.put(`battery/reactive/${batteryId}`)
            return { success: true }
        } catch (error) {
            handleAPIError(error)
        }
    }

    return { createBattery, getBatteriesAll, getBatteriesActive, updateBattery, deleteBattery, errorMessages, setErrorMessages, reactiveBattery }
}

export default BatteryServices;