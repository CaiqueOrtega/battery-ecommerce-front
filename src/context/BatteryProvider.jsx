import { useEffect, createContext, useState } from "react";
import BatteryServices from '../services/battery/BatteryServices';

const BatteryContext = createContext({});

function BatteryProvider({ children }) {
    const { getBatteries } = BatteryServices();
    const [batteries, setBatteries] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [getDataBatteries, setGetDataBatteries] = useState(false);

    const fetchBatteries = async () => {
            try {
                const batteryData = await getBatteries();
                console.log(batteryData)
                console.log('Pegou os dados de bateria')
                setBatteries(batteryData);
                setIsContextLoaded(true);
            } catch (error) {
                console.log(error);
            }
    };
    

    useEffect( () => {
         fetchBatteries();
    }, [getDataBatteries])

    return isContextLoaded ? (
        <BatteryContext.Provider value={{ batteries, setGetDataBatteries }}>
            {children}
        </BatteryContext.Provider>
    ) : null;

}

export { BatteryContext, BatteryProvider };
