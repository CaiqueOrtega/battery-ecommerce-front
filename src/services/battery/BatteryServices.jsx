import ConnectionAPI from "../ConnectionAPI";
import { useState, useEffect } from "react";
import { BatteryCardRegisterExample } from "../../pages/battery/BatteryIndex"; 

const BaterryServices = () => {


    const createBattery = async (batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
           const response = await ConnectionAPI.post('battery',{
                name: batteryName,
                description: batteryDescription,
                value: batteryPrice,
                quantity: batteryQuantity
            });
            
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

    const showBatteries = () => {
        const [batteries, setBatteries] = useState([]);
    
        useEffect(() => {
            async function fetchBatteries() {
                try {
                    const { getBatteries } = BaterryServices();
                    const batteriesData = await getBatteries();
                    setBatteries(batteriesData);
                } catch (error) {
                    console.error('Erro ao carregar baterias');
                }
            }
    
            fetchBatteries();
        }, []);
        return (
            <div className=' me-5'>
                <div className='d-flex flex-row justify-content-evenly'>
                    {batteries.map(battery => (
                    <BatteryCardRegisterExample
                        key={battery.batteryId}
                        productName={battery.name}
                        productDescription={battery.description}
                        productPrice={battery.value}
                        productQuantity={battery.quantity}
                    />
                    ))}
                </div>
           </div>
        );
      }

    return { createBattery, getBatteries, showBatteries }

    
}

export default BaterryServices;