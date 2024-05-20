import { createContext, useContext, useEffect, useState } from "react";
import CartServices from "../services/cart/BatteryCartServices";
import { AuthContext } from "./AuthProvider";

const BatteryCartContext = createContext({})

function BatteryCartProvider({ children }) {
    const [batteryCart, setBatteryCart] = useState({});
    const { getByUser } = CartServices();
    const { userData } = useContext(AuthContext);

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

    useEffect(() => {
        if (userData?.userId) {
            handleCartUser(userData.userId);
        }
    }, [userData]);

    return (
        <BatteryCartContext.Provider value={{ batteryCart, setBatteryCart }}>
            {children}
        </BatteryCartContext.Provider>
    );
}

export { BatteryCartContext, BatteryCartProvider };
