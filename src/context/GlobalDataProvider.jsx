import React, { useEffect, createContext, useState, useContext } from "react";
import BatteryServices from '../services/battery/BatteryServices';
import { AuthContext } from "./AuthProvider";
import AddressServices from '../services/address/AddressServices';
import BatteryCartServices from "../services/cart/BatteryCartServices";
import CardServices from "../services/card/CardServices";
import DeliveryServices from "../services/delivery/DeliveryServices";

const GlobalDataContext = createContext({});

function GlobalDataProvider({ children }) {
    const { isLoggedIn, userData } = useContext(AuthContext);

    const { getBatteriesActive } = BatteryServices();
    const [fetchBatteryData, setFetchBatteryData] = useState(false);
    const [batteriesActive, setBatteriesActive] = useState([]);
    const [batteriesActiveIsLoaded, setBatteriesActiveIsLoaded] = useState(false);

    const { getAddressByUserId } = AddressServices();
    const [address, setAddress] = useState([]);
    const [addressIsLoaded, setAddressIsLoaded] = useState(null);

    const [batteryCart, setBatteryCart] = useState({});
    const [batteryCartIsLoaded, setBatteryCartIsLoaded] = useState(null);

    const { getByListBatteries } = BatteryServices();
    const { getByUser } = BatteryCartServices();

    const { getAllCardByUser } = CardServices();
    const [card, setCard] = useState([]);
    const [cardIsLoaded, setCardIsLoaded] = useState(null);

    const [deliveryUser, setDeliveryUser] = useState(null)
    const [deliveryIsLoaded, setDeliveryIsLoaded] = useState(null);
    const { getAllDeliveriesByUser } = DeliveryServices();

    const fetchBatteries = async () => {
        try {
            const batteryData = await getBatteriesActive();
            setBatteriesActive(batteryData);
        } catch (error) {
            console.error("Erro ao buscar baterias ativas:", error);
        } finally {
            setBatteriesActiveIsLoaded(true)
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
        } finally {
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
            } finally {
                setBatteryCartIsLoaded(true);
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

                setBatteryCart({
                    cardId: cartData.cartId,
                    totalValue: cartData.totalValue || 0,
                    promotion: cartData.promotion || null,
                    itemsQuantity: cartData.itemsQuantity || 0,
                    batteries: updatedBatteries
                });
            }
        } catch (error) {
            console.error("Falha ao pegar carrinho (não logado):", error);
        } finally {
            setBatteryCartIsLoaded(true);
        }
    };


    const fetchCard = async () => {
        if (!cardIsLoaded) {
            try {
                const cardData = await getAllCardByUser(userData.userId);
                setCard(cardData);
            } catch (error) {
                console.error("Erro ao buscar baterias ativas:", error);
            } finally {
                setCardIsLoaded(true);
            }
        }
    };

    const fetchUserDelivery = async () => {
        if (!deliveryIsLoaded) {
            try {
                const deliveryUserData = await getAllDeliveriesByUser(userData.userId);
                setDeliveryUser(deliveryUserData);
            } catch (error) {
                console.error("Erro ao buscar pedidos", error);
            } finally {
                setDeliveryIsLoaded(true);
            }
        }
    }

    useEffect(() => {
        if (userData?.userId && isLoggedIn) {
            fetchCartLogged(userData.userId);
        } else {
            fetchCartNotLogged();
        }

    }, [userData, isLoggedIn]);


    useEffect(() => {
        fetchBatteries();
    }, [fetchBatteryData]);

    const resetGlobalData = () => {
        setAddress({});
        setBatteryCart({})
    }

    return (
        <GlobalDataContext.Provider value={{
            batteriesActive,
            batteriesActiveIsLoaded,
            setFetchBatteryData,
            fetchAddress,
            addressIsLoaded,
            address,
            setAddress,
            batteryCart,
            batteryCartIsLoaded,
            setBatteryCart,
            card,
            setCard,
            fetchCard,
            cardIsLoaded,
            fetchUserDelivery,
            deliveryUser,
            setDeliveryUser,
            deliveryIsLoaded,
            resetGlobalData,
            userData,
            isLoggedIn
        }}>
            {children}
        </GlobalDataContext.Provider>
    )
}

export { GlobalDataContext, GlobalDataProvider };

export const useGlobalDataProvider = () => useContext(GlobalDataContext);
