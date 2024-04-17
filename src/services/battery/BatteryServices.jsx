import ConnectionAPI from "../ConnectionAPI";


const BaterryServices = () => {
    const createBattery = async (batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
            const response = await ConnectionAPI.post('battery', {
                name: batteryName,
                description: batteryDescription,
                value: batteryPrice,
                quantity: batteryQuantity
            });
            return response.status
        } catch (error) {
            console.log(error)
        }
    }

    const getBatteries = async () => {
        try {
            const response = await ConnectionAPI.get('battery')
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    }

    const updateBattery = async (batteryId, batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
            const response = await ConnectionAPI.put(`battery/${batteryId}`, {
                name: batteryName,
                description: batteryDescription,
                value: batteryPrice,
                quantity: batteryQuantity
            }
            )
            return response.status;

        } catch (error) {
            console.log(error);
        }
    }

    const deleteBattery = async (batteryId) => {
        try {
            const response = await ConnectionAPI.delete(`battery/${batteryId}`)

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return { createBattery, getBatteries, updateBattery, deleteBattery }
}

export default BaterryServices;