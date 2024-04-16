import ConnectionAPI from "../ConnectionAPI";
import { useState, useEffect, useContext } from "react";
import { BatteryCardRegisterExample } from "../../pages/battery/BatteryIndex";
import { Table } from 'react-bootstrap';
import { AuthContext } from "../../context/AuthProvider";
import { useLocation, Link } from "react-router-dom";

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

    const showBatteries = () => {
        const [batteries, setBatteries] = useState([]);
        const { navigate } = useContext(AuthContext);

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
            <div className="">
                <Table responsive striped  hover>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batteries.map(battery => (
                            <tr key={battery.batteryId} onClick={() => navigate('/bateria')}>
                                <td>{battery.name}</td>
                                <td>{battery.description}</td>
                                <td>{battery.value}</td>
                                <td>{battery.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    }

    return { createBattery, getBatteries, showBatteries }


}

export default BaterryServices;