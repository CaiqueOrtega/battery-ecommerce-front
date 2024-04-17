import { useEffect, createContext, useState } from "react";
import BatteryServices from '../services/battery/BatteryServices';

const BatteryContext = createContext({});

function BatteryProvider({ children }) {
    const { getBatteries } = BatteryServices();
    const [batteries, setBatteries] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);

    useEffect(() => {
        const fetchBatteries = async () => {
            try {
                const batteryData = await getBatteries();
                setBatteries(batteryData);
            } catch (error) {
                console.log(error);
            }
            console.log(batteries);
            setIsContextLoaded(true);
        };

        fetchBatteries();
    }, [ ])

    return isContextLoaded ? (
        <BatteryContext.Provider value={{ batteries }}>
            {children}
        </BatteryContext.Provider>
    ) : null;

}

export { BatteryContext, BatteryProvider };
