import { createContext, useContext, useEffect, useState } from "react";
import CartServices from "../services/cart/CartServices";
import { AuthContext } from "./AuthProvider";

const CartContext = createContext({})

function CartProvider({ children }) {
    const [cart, setCart] = useState({})
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const { getByUser } = CartServices()
    const { userData } = useContext(AuthContext)

    async function handleCartUser(userId) {
        if (userId != null) {
            const response = await getByUser(userId)
            setCart(response)
            setIsContextLoaded(true)
            console.log(response)
        }
    }

    useEffect(() => {
        if (userData && userData.userId) {
            handleCartUser(userData.userId)
        }
    }, [userData])

    useEffect(() => {
        console.log('cart', cart)
    }, [cart])


    return isContextLoaded ? (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    ) : null
}

export { CartContext, CartProvider }