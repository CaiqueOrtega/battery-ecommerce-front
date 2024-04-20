import { useEffect, createContext, useState } from "react";
import PromotionService from "../services/promotion/PromotionService";

const PromotionContext = createContext({})

function PromotionProvider({children}){
    const { getPromotions } = PromotionService()
    const [promotions, setPromotions] = useState([])
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [updateTable, setUpdateTable] = useState(false);

    const fetchPromotions = async () => {
        try{
            const promotionsData = await getPromotions()
            setPromotions(promotionsData)
            setIsContextLoaded(true);
        }catch (error){
            console.log("ERRO AQUI")
        }
    }

    useEffect(() => {
        fetchPromotions()
    }, [updateTable])

    return isContextLoaded ? (
        <PromotionContext.Provider value={{promotions, setUpdateTable}}>
            {children}
        </PromotionContext.Provider>
    ) : null
}

export {PromotionContext, PromotionProvider}