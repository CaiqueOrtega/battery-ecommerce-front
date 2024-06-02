import React, { createContext, useContext, useEffect, useState } from "react";
import PromotionService from "../services/promotion/PromotionService";
import UserService from "../services/users/UsersServices";
import BatteryServices from "../services/battery/BatteryServices";

const DashBoardContext = createContext({});

function DashBoardProvider({ children }) {
    const { getPromotions } = PromotionService();
    const { getUsers } = UserService();
    const { getBatteriesAll } = BatteryServices();
    const [batteries, setBatteries] = useState([]);
    const [users, setUsers] = useState([]);
    const [promotions, setPromotions] = useState([]);
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
                }

                setIsContextLoaded(true);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [renderOptionData]);


    return isContextLoaded ? (
            <DashBoardContext.Provider value={{ promotions, setPromotions, users, setUsers, batteries, setBatteries, setRenderOptionData }}>
                {children}
            </DashBoardContext.Provider>
    ) : null;
}

export { DashBoardProvider, DashBoardContext };

export const useDashBoardProvider = () => useContext(DashBoardContext);