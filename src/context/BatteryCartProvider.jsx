import { createContext, useContext, useEffect, useState } from "react";
import BatteryCartServices from "../services/cart/BatteryCartServices";
import BatteryServices from "../services/battery/BatteryServices";
import { AuthContext } from "./AuthProvider";

const BatteryCartContext = createContext({})

function BatteryCartProvider({ children }) {
    const [batteryCart, setBatteryCart] = useState({});
    const { getByListBatteries } = BatteryServices();
    const { getByUser } = BatteryCartServices();
    const { userData, isLoggedIn } = useContext(AuthContext);

    const handleCartUser = async (userId) => {
        if (userId) {
            try {
                const response = await getByUser(userId);
                setBatteryCart(response);
            } catch (error) {
                console.error("falha ao pegar carrinho:", error);
            }
        }
    };


    const handleCartNotLogged = async () => {
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
                handleCartUser(userData.userId);
            } else {
                handleCartNotLogged();
            }
        }
    }, [userData, isLoggedIn]);

    return (
        <BatteryCartContext.Provider value={{ batteryCart, setBatteryCart }}>
            {children}
        </BatteryCartContext.Provider>
    );
}

export { BatteryCartContext, BatteryCartProvider };
