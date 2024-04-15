import ConnectionAPI from "../ConnectionAPI";
import { useState, useEffect } from "react";
import { BatteryCardRegisterExample } from "../../pages/battery/BatteryIndex"; 
import { Row, Col } from 'react-bootstrap';

const BaterryServices = () => {


    const createBattery = async (batteryName, batteryDescription, batteryPrice, batteryQuantity) => {
        try {
           const response = await ConnectionAPI.post('battery',{
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
            <div className="ms-5">
                <Row xs={1} md={3} >
                    {batteries.map(battery => (
                        <Col key={battery.batteryId} className="d-flex justify-content-center mb-5">
                            <BatteryCardRegisterExample
                                productName={battery.name}
                                productDescription={battery.description}
                                productPrice={battery.value}
                                productQuantity={battery.quantity}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        );
      }

    return { createBattery, getBatteries, showBatteries }

    
}

export default BaterryServices;