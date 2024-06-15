import React, { createContext, useContext, useEffect, useState } from "react";
import PromotionService from "../services/promotion/PromotionService";
import UserService from "../services/users/UsersServices";
import BatteryServices from "../services/battery/BatteryServices";
import SaleServices from "../services/sale/SaleServices";
import DeliveryServices from "../services/delivery/DeliveryServices";

const DashBoardContext = createContext({});

function DashBoardProvider({ children }) {
    const { getPromotions } = PromotionService();
    const [promotions, setPromotions] = useState([]);

    const { getUsers } = UserService();
    const [users, setUsers] = useState([]);

    const { getBatteriesAll } = BatteryServices();
    const [batteries, setBatteries] = useState([]);

    const { getAllSales } = SaleServices();
    const [sales, setSales] = useState([]);

    const { getAllDeliveries } = DeliveryServices();
    const [deliveries, setDeliveries] = useState([])

    const [renderOptionData, setRenderOptionData] = useState('');
    const [isContextLoaded, setIsContextLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (renderOptionData === 'Usuários' && !users.length) {
                    const usersData = await getUsers();
                    setUsers(usersData);
                } else if (renderOptionData === 'Promoções' && !promotions.length) {
                    const promotionsData = await getPromotions();
                    setPromotions(promotionsData);
                } else if (renderOptionData === 'Baterias' && !batteries.length) {
                    const batteryData = await getBatteriesAll();
                    setBatteries(batteryData);
                } else if (renderOptionData === 'Vendas' && !sales.length) {
                    const salesData = await getAllSales();
                    setSales(salesData);

                } else if (renderOptionData === 'Entregas' && !deliveries.length) {
                    const deliveriesData = await getAllDeliveries();
                    setDeliveries(deliveriesData);
                }

                setIsContextLoaded(true);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [renderOptionData]);


    return isContextLoaded ? (
        <DashBoardContext.Provider value={{ promotions, setPromotions, users, setUsers, batteries, setBatteries, setRenderOptionData, sales, setSales, deliveries, setDeliveries }}>
            {children}
        </DashBoardContext.Provider>
    ) : null;
}

export { DashBoardProvider, DashBoardContext };

export const useDashBoardProvider = () => useContext(DashBoardContext);