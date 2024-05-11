import { useEffect, createContext, useState } from "react";
import BatteryServices from '../services/battery/BatteryServices';

const BatteryContext = createContext({});

function BatteryProvider({ children }) {
    const { getBatteriesActive } = BatteryServices();
    const [batteriesActive, setBatteriesActive] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [ getBatteryActive, setGetBatteryActive ] = useState(false);
    const fetchBatteries = async () => {
        console.log('entrou2')
        try {
            const batteryData = await getBatteriesActive();
            setBatteriesActive(batteryData);
        } catch (error) {
            console.log(error);
        }
        setIsContextLoaded(true);
      
    };

    useEffect(()=>{
            fetchBatteries();
    },[ getBatteryActive ])


    return isContextLoaded ? (
        <BatteryContext.Provider value={{ batteriesActive , setBatteriesActive, setGetBatteryActive }}>
            {children}
        </BatteryContext.Provider>
    ) : null;

}

export { BatteryContext, BatteryProvider };
