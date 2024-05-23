import React, { useEffect, createContext, useState, useContext } from "react";
import BatteryServices from '../services/battery/BatteryServices';
import { AuthContext } from "./AuthProvider";
import AddressServices from '../services/address/AddressServices';

const GlobalDataContext = createContext({});

function GlobalDataProvider({ children }) {
    const { isLoggedIn, userData } = useContext(AuthContext);
    const { getBatteriesActive } = BatteryServices();
    const { getAddressByUserId } = AddressServices();
    const [batteriesActive, setBatteriesActive] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [fetchBatteryData, setFetchBatteryData] = useState(false);
    const [addressValues, setAddressValues] = useState([]);
    const [addressIsLoaded, setAddressIsLoaded] = useState(false);

    const fetchBatteries = async () => {
        try {
            const batteryData = await getBatteriesActive();
            setBatteriesActive(batteryData);
        } catch (error) {
            console.error("Erro ao buscar baterias ativas:", error);
        } finally {
            setIsContextLoaded(true);
        }
    };

    const fetchAddress = async () => {
        try {
            if (isLoggedIn && userData?.userId && !addressIsLoaded) {
                const response = await getAddressByUserId(userData.userId);
                setAddressValues(response);
                setAddressIsLoaded(true);
            }
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
        }
    };

    useEffect(() => {
            fetchBatteries();
    }, [fetchBatteryData]);


    return isContextLoaded ? (
        <GlobalDataContext.Provider value={{
            batteriesActive,
            setFetchBatteryData,
            fetchAddress,
            addressIsLoaded,
            addressValues,
            setAddressValues,
        }}>
            {children}
        </GlobalDataContext.Provider>
    ) : (
        <div>Loading...</div>
    );
}

export { GlobalDataContext, GlobalDataProvider };

export const useGlobalData = () => useContext(GlobalDataContext);
