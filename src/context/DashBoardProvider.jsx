import React, { createContext, useContext, useEffect, useState } from "react";
import PromotionService from "../services/promotion/PromotionService";
import UserService from "../services/users/UsersServices";
import { BatteryContext } from "./BatteryProvider";

const DashBoardContext = createContext({});

function DashBoardProvider({ children }) {
    const { getPromotions } = PromotionService();
    const { getUsers } = UserService();
    const { batteries, setGetDataBatteries } = useContext(BatteryContext);

    const [users, setUsers] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [renderOptionData, setRenderOptionData] = useState('');
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [updateData, setUpdateData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (renderOptionData === 'Usuários' && !users.length ) {
                    const usersData = await getUsers();
                    setUsers(usersData);
                } else if (renderOptionData === 'Promoções' && !promotions.length) {
                    const promotionsData = await getPromotions();
                    setPromotions(promotionsData);
                } else if (renderOptionData === 'Baterias' && !batteries.length) {
                    setGetDataBatteries(true);
                }
                setIsContextLoaded(true);
            } catch (error) {
                console.log("Erro ao buscar dados:", error);
            }
        };
        fetchData();
    }, [renderOptionData]);


    return isContextLoaded ? (
        <DashBoardContext.Provider value={{ promotions, users, batteries, setRenderOptionData }}>
            {children}
        </DashBoardContext.Provider>
    ) : null;
}

export { DashBoardProvider, DashBoardContext };
