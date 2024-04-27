import { useEffect, createContext, useState } from "react";
import BatteryServices from '../services/battery/BatteryServices';

const BatteryContext = createContext({});

function BatteryProvider({ children }) {
    const { getBatteries } = BatteryServices();
    const [batteries, setBatteries] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [updateTable, setUpdateTable] = useState();
    const [shouldLoadBatteryData, setShouldLoadBatteryData] = useState(false);

    const fetchBatteries = async () => {
        if (shouldLoadBatteryData) {
            try {
                const batteryData = await getBatteries();
                setBatteries(batteryData);
                console.log('Pegou os dados');
            } catch (error) {
                console.log(error);
            }
        }
        setIsContextLoaded(true);
    };

    useEffect(() => {
        console.log('entrou em usseEffect batteryProvider');
        fetchBatteries();
    }, [updateTable, shouldLoadBatteryData])

    return isContextLoaded ? (
        <BatteryContext.Provider value={{ batteries, setUpdateTable, isContextLoaded, setShouldLoadBatteryData }}>
            {children}
        </BatteryContext.Provider>
    ) : null;

}

export { BatteryContext, BatteryProvider };
