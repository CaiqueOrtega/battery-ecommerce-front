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
    const [contentSettings, setContentSettings] = useState({ showNavbarSearch: true, footer: true, isCartPage: false })


    const handleGetContent = useMemo(() => {
        let pageTitle = "";
        let content = null;
        let actionType = action || 'home';

        if (type === 'detalhes') actionType = `${action}/${type}`

        switch (actionType) {
            case "home":
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: true,  isCartPage: false }));
                pageTitle = "Página Inicial";
                content = <HomePage />;
                break;
            case `bateria/detalhes`:
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: false,  isCartPage: false }));
                pageTitle = "Detalhes da Bateria";
                content = <BatteryPurchasePage />;
                break;
            case "configuracoes":
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: false,  isCartPage: false }));
                pageTitle = "Configurações";
                content = <SettingsPage />;
                break;

            case "meucarrinho":
                setContentSettings(prevSettings => ({ ...prevSettings, showNavbarSearch: true, isCartPage: true }));
                pageTitle = "Carrinho de Compras";
                content = <CartPage />;
                break;
            default:
                return (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <p>Ops... Essa funcionalidade ainda não foi implementada. Por favor aguarde.</p>
                    </div>
                );
                break;
        }

        document.title = pageTitle;
        return content;
    }, [action, type]);


    return (
        <Row className="flex-column justify-content-between g-0" style={{ minHeight: '100vh' }}>
            <Col xs={12} className="p-0">
                <NavbarComponent showNavbarSearch={contentSettings.showNavbarSearch} isCartPage={contentSettings.isCartPage} />
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