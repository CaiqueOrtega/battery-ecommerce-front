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
    const [promotionIsLoaded, setPromotionIsLoaded] = useState(false);

    const { getUsers } = UserService();
    const [users, setUsers] = useState([]);
    const [usersIsLoaded, setUsersIsLoaded] = useState(false);

    const { getBatteriesAll } = BatteryServices();
    const [batteries, setBatteries] = useState([]);
    const [batteriesIsLoaded, setBatteriesIsLoaded] = useState(false)

    const { getAllSales } = SaleServices();
    const [sales, setSales] = useState([]);
    const [salesIsLoaded, setSalesIsLoaded] = useState(false);

    const { getAllDeliveries } = DeliveryServices();
    const [deliveries, setDeliveries] = useState([])
    const [deliveriesIsLoaded, setDeliveriesIsLoaded] = useState(false);

    const [renderOptionData, setRenderOptionData] = useState('');
    const [isContextLoaded, setIsContextLoaded] = useState(false);

    useEffect(() => {
        const dataFetchers = {
            'Usuários': {
                fetcher: getUsers,
                setter: setUsers,
                isLoadedSetter: setUsersIsLoaded
            },
            'Promoções': {
                fetcher: getPromotions,
                setter: setPromotions,
                isLoadedSetter: setPromotionIsLoaded
            },
            'Baterias': {
                fetcher: getBatteriesAll,
                setter: setBatteries,
                isLoadedSetter: setBatteriesIsLoaded
            },
            'Vendas': {
                fetcher: getAllSales,
                setter: setSales,
                isLoadedSetter: setSalesIsLoaded
            },
            'Entregas': {
                fetcher: getAllDeliveries,
                setter: setDeliveries,
                isLoadedSetter: setDeliveriesIsLoaded
            }
        };
    
        const fetchData = async () => {
            try {
                const dataFetcher = dataFetchers[renderOptionData];
                if (dataFetcher) {
                    const data = await dataFetcher.fetcher();
                    dataFetcher.setter(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                const dataFetcher = dataFetchers[renderOptionData];
                if (dataFetcher) {
                    dataFetcher.isLoadedSetter(true);
                }
                setIsContextLoaded(true);
            }
        };
    
        fetchData();
    }, [renderOptionData]);



    return isContextLoaded ? (
        <DashBoardContext.Provider value={{ promotions, setPromotions, users, setUsers, batteries, setBatteries, setRenderOptionData, sales, setSales, deliveries, setDeliveries, promotionIsLoaded, usersIsLoaded, batteriesIsLoaded,  salesIsLoaded, deliveriesIsLoaded }}>
            {children}
        </DashBoardContext.Provider>
    ) : null;
}

export { DashBoardProvider, DashBoardContext };

export const useDashBoardProvider = () => useContext(DashBoardContext);