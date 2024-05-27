import React, { useEffect, createContext, useState, useContext } from "react";
import BatteryServices from '../services/battery/BatteryServices';
import { AuthContext } from "./AuthProvider";
import AddressServices from '../services/address/AddressServices';
import BatteryCartServices from "../services/cart/BatteryCartServices";

const GlobalDataContext = createContext({});

function GlobalDataProvider({ children }) {
    const { isLoggedIn, userData } = useContext(AuthContext);

    const { getBatteriesActive } = BatteryServices();
    const [fetchBatteryData, setFetchBatteryData] = useState(false);
    const [batteriesActive, setBatteriesActive] = useState([]);

    const { getAddressByUserId } = AddressServices();
    const [address, setAddress] = useState([]);
    const [addressIsLoaded, setAddressIsLoaded] = useState(null);

    const [batteryCart, setBatteryCart] = useState({});
    const { getByListBatteries } = BatteryServices();
    const { getByUser } = BatteryCartServices();

    const fetchBatteries = async () => {
        try {
            const batteryData = await getBatteriesActive();
            setBatteriesActive(batteryData);
        } catch (error) {
            console.error("Erro ao buscar baterias ativas:", error);
        }
    };

    const fetchAddress = async () => {
        try {
            if (isLoggedIn && userData?.userId && !addressIsLoaded) {
                const response = await getAddressByUserId(userData.userId);
                setAddress(response);
            }
        } catch (error) {
            console.error("Erro ao buscar endereço:", error);
        }finally{
            console.log('BATATA MUITO MAIS DOCE')
            setAddressIsLoaded(true);
        }
    };


    const fetchCartLogged = async (userId) => {
        if (userId) {
            try {
                const response = await getByUser(userId);
                setBatteryCart(response);
            } catch (error) {
                console.error("falha ao pegar carrinho:", error);
            }
        }
    };

    const fetchCartNotLogged = async () => {
        try {
            const storedCart = localStorage.getItem('batteryCart');
            if (storedCart) {
                const cartData = JSON.parse(storedCart);
                const batteriesId = cartData.batteries.map(battery => battery.batteryId);
                const response = await getByListBatteries(batteriesId);

                const updatedBatteries = cartData.batteries.map(cartBattery => {
                    const matchingBattery = response.find(battery => battery.batteryId === cartBattery.batteryId);
                    if (matchingBattery) {
                        return {
                            cart_battery_id: cartBattery.cart_battery_id,
                            quantity: cartBattery.quantity,
                            battery: { ...matchingBattery }
                        };
                    }
                    return null;
                }).filter(battery => battery !== null);

                const totalValue = cartData.totalPrice || 0;

                setBatteryCart({
                    totalValue: totalValue,
                    promotion: cartData.promotion || null,
                    batteries: updatedBatteries
                });
                console.log('Carrinho de Bateria (não logado):', updatedBatteries);
            }
        } catch (error) {
            console.error("Falha ao pegar carrinho (não logado):", error);
        }
    };


    useEffect(() => {
        if(Object.keys(batteryCart).length === 0){
            console.log('entrou');
            if (userData?.userId && isLoggedIn) {
                fetchCartLogged(userData.userId);
            } else {
                fetchCartNotLogged();
            }
        }
    }, [userData, isLoggedIn]);


    useEffect(() => {
        fetchBatteries();
    }, [fetchBatteryData]);

    const resetGlobalData= () => {
        setAddress({});
        setBatteryCart({})
    }

    return (
        <GlobalDataContext.Provider value={{
            batteriesActive,
            setFetchBatteryData,
            fetchAddress,
            addressIsLoaded,
            address,
            setAddress,
            batteryCart, 
            setBatteryCart,
            resetGlobalData
        }}>
            {children}
        </GlobalDataContext.Provider>
    )
}

export { GlobalDataContext, GlobalDataProvider };

export const useGlobalDataProvider = () => useContext(GlobalDataContext);
