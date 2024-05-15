import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarComponent from '../../components/layout/navbar/Navbar';

function BatteryPurchasePage() {
    const location = useLocation();
    const batteryData = location.state;

    return (
        <div>
            <NavbarComponent setNavbarContent={true} />
            <h2>Detalhes da Bateria</h2>
            <p>Nome: {batteryData.name}</p>
            <p>Descrição: {batteryData.description}</p>
            <p>Preço: {batteryData.value}</p>
        </div>
    );
}

export default BatteryPurchasePage;
