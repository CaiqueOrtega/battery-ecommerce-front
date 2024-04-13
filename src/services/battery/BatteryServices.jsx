import ConnectionAPI from "../ConnectionAPI";

const BaterryServices = () => {


    const createBattery = async (batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
           const response = await ConnectionAPI.post('/battery',{
                name: batteryName,
                description: batteryDescription,
                value: batteryPrice,
                quantity: batteryQuantity
            });
            
        } catch (error) {
            console.log(error)
        }
    }

    return { createBattery }
}

export default BaterryServices;