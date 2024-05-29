import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import NavbarComponent from "./layout/navbar/Navbar";
import FooterComponent from "./layout/footer/Footer";

import HomePage from "../home/HomePage";
import BatteryPurchasePage from "../batteryPurchase/BatteryPurchasePage";
import SettingsPage from "../settings/SettingsPage";
import CartPage from "../cart/CartPage";

function BaseLayoutPage() {
    const { action, type } = useParams();
    const [contentSettings, setContentSettings] = useState({ showNavbarSearch: true, footer: true, })


    const handleGetContent = useMemo(() => {
        let pageTitle = "";
        let content = null;
        let actionType = action || 'home';

        if (type === 'detalhes') actionType = `${action}/${type}`

        switch (actionType) {
            case "home":
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: true }));
                pageTitle = "Página Inicial";
                content = <HomePage />;
                break;
            case `bateria/detalhes`:
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: false }));
                pageTitle = "Detalhes da Bateria";
                content = <BatteryPurchasePage />;
                break;
            case "configuracoes":
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: false }));
                pageTitle = "Configurações";
                content = <SettingsPage />;
                break;

            case "meucarrinho":
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: true }));
                pageTitle = "Carrinho de Compras";
                content = <CartPage />;
                break;
            default:
                console.log('default');
                break;
        }

        document.title = pageTitle;
        return content;
    }, [action, type]);


    return (
        <Row className="flex-column justify-content-between g-0" style={{ minHeight: '100vh' }}>
            <Col xs={12} className="p-0">
                <NavbarComponent showNavbarSearch={contentSettings.showNavbarSearch} />
            </Col>

            <Col xs={12} className="p-0 flex-grow-1 d-flex flex-column">
                {handleGetContent}
            </Col>

            {contentSettings.footer && (
                <Col xs={12} className="p-0">
                    <FooterComponent />
                </Col>

            )}
        </Row>
    )
}

export default BaseLayoutPage;