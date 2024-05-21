import { createContext, useContext, useEffect, useState } from "react";
import BatteryCartServices from "../services/cart/BatteryCartServices";
import BatteryServices from "../services/battery/BatteryServices";
import { AuthContext } from "./AuthProvider";

const BatteryCartContext = createContext({})

function BatteryCartProvider({ children }) {
    const [batteryCart, setBatteryCart] = useState({});
    const { getByListBatteries } = BatteryServices ();
    const { getByUser } = BatteryCartServices();
    const { userData, isLoggedIn } = useContext(AuthContext);

    const handleCartUser = async (userId) => {
        if (userId) {
            try {
                const response = await getByUser(userId);
                setBatteryCart(response);
                console.log('Carrinho de Bateria:', response);
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
                setBatteryCart({ batteries: response});
                console.log('Carrinho de Bateria (não logado):', response);
            }
        } catch (error) {
            console.error("Falha ao pegar carrinho (não logado):", error);
        }
    };

    useEffect(() => {
        if (userData?.userId && isLoggedIn) {
            handleCartUser(userData.userId);
        } else {
            handleCartNotLogged();
        }
    }, [userData, isLoggedIn]);

    return (
        <BatteryCartContext.Provider value={{ batteryCart, setBatteryCart }}>
            {children}
        </BatteryCartContext.Provider>
    );
}

export { BatteryCartContext, BatteryCartProvider };
