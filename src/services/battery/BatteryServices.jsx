import ConnectionAPI from "../ConnectionAPI";
import { useState } from "react";

const BatteryServices = () => {
    const [errorMessages, setErrorMessages] = useState({});


    const createBattery = async (batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
            await ConnectionAPI.post('battery', {
                name: batteryName,
                description: batteryDescription,
                value: batteryPrice,
                quantity: batteryQuantity
            });
            return { success: true }
        } catch (error) {
            handleAPIError(error);
            return { success: false }
        }
    }

    const getBatteries = async () => {
        try {
            const response = await ConnectionAPI.get('battery')
            return response.data
        } catch (error) {
            console.log('TESTE batterie')
        }
    }

    const updateBattery = async (batteryId, batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
            await ConnectionAPI.patch(`battery/${batteryId}`, {
                name: batteryName,
                description: batteryDescription,
                value: batteryPrice,
                quantity: batteryQuantity
            }
            )
            return { success: true }
        } catch (error) {
            handleAPIError(error);
            return { success: false }
        }
    }

    const deleteBattery = async (batteryId) => {
        try {
            await ConnectionAPI.delete(`battery/${batteryId}`)

            return { success: true }
        } catch (error) {
            console.log(error);
            return { success: false }
        }
    }

    const handleAPIError = (error) => {
        if (error.response.data.field) {
            const { field, message } = error.response.data;
            setErrorMessages({ [field]: message });
        } else if (error.response.data.message) {
            setErrorMessages({ general: error.response.data.message });
        } else {
            setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
        }
    };


    return { errorMessages, setErrorMessages, createBattery, getBatteries, updateBattery, deleteBattery }
}

export default BatteryServices;