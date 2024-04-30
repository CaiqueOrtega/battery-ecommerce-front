import { useEffect, createContext, useState } from "react";
import BatteryServices from '../services/battery/BatteryServices';

const BatteryContext = createContext({});

function BatteryProvider({ children }) {
    const { getBatteries } = BatteryServices();
    const [batteries, setBatteries] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [updateTable, setUpdateTable] = useState();

    const fetchBatteries = async () => {
        try {
            const batteryData = await getBatteries();
            setBatteries(batteryData);
        } catch (error) {
            console.log(error);
        }
        setIsContextLoaded(true);
    };

    useEffect(() => {

        fetchBatteries();
    }, [updateTable])

    return isContextLoaded ? (
        <BatteryContext.Provider value={{ batteries, setUpdateTable, isContextLoaded }}>
            {children}
        </BatteryContext.Provider>
    ): null;

}

export { BatteryContext, BatteryProvider };
