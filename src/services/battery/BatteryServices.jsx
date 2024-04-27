import ConnectionAPI from "../ConnectionAPI";

const BatteryServices = () => {

    const getBatteries = async () => {
        try {
            const response = await ConnectionAPI.get('battery')
            return response.data
        } catch (error) {
            console.log('TESTE batterie')
        }
    }

    const createBattery = async (batteryValues) => {
        try {
            await ConnectionAPI.post('battery', {
                name: batteryValues.name,
                description: batteryValues.description,
                value: batteryValues.value,
                quantity: batteryValues.quantity
            });
            return { success: true }
        } catch (error) {
            console.log("Create battery", error)
            return error;
        }
    }

    const updateBattery = async (batteryId, batteryValues) => {
        console.log("TESTE UPDATE", batteryId, batteryValues);
        try {
            await ConnectionAPI.patch(`battery/${batteryId}`, {
                name: batteryValues.name,
                description: batteryValues.description,
                value: batteryValues.value,
                quantity: batteryValues.quantity
            }
            )
            return { success: true }
        } catch (error) {
            return error;
        }
    }

    const deleteBattery = async (batteryId) => {
        try {
            await ConnectionAPI.delete(`battery/${batteryId}`)

            return { success: true }
        } catch (error) {
            return error;
        }
    }

    return { createBattery, getBatteries, updateBattery, deleteBattery }
}

export default BatteryServices;