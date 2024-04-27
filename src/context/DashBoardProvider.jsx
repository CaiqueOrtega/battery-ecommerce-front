import React, { createContext, useContext, useEffect, useState } from "react";
import PromotionService from "../services/promotion/PromotionService";
import UserService from "../services/users/UsersServices";
import { BatteryContext } from "./BatteryProvider";

const DashBoardContext = createContext({});

function DashBoardProvider({ children }) {
    const { getPromotions } = PromotionService();
    const { getUsers } = UserService();
    const [promotions, setPromotions] = useState([]);
    const [users, setUsers] = useState([]);
    const [content, setContent] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [updateTable, setUpdateTable] = useState(false);
    const { batteries, setShouldLoadBatteryData } = useContext(BatteryContext);
    const [isContextLoaded, setIsContextLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (content === 'Usuários' || updateContent === 'Usuários') {
                try {
                    const usersData = await getUsers();
                    setUsers(usersData);
                } catch (error) {
                    console.log("Erro ao buscar usuários:", error);
                }
            } else if (content === 'Promoções' || updateContent === 'Promoções') {
                try {
                    const promotionsData = await getPromotions();
                    setPromotions(promotionsData);
                } catch (error) {
                    console.log("Erro ao buscar promoções:", error);
                }
            } else if (content === 'Baterias') {
                if (!Object.keys(batteries).length) {
                    setShouldLoadBatteryData(true);
                }
            }
            setIsContextLoaded(true);
        };

        fetchData();

    }, [content, updateTable]);



    if (!isContextLoaded ) {
        return <div>Carregando...</div>;
    }

    return (
        <DashBoardContext.Provider value={{ promotions, users, setContent, setUpdateContent, setUpdateTable, batteries }}>
            {children}
        </DashBoardContext.Provider>
    )
}


export { DashBoardProvider, DashBoardContext };
