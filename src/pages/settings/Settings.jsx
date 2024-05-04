import React, { useEffect, useState, useRef } from "react";
import NavbarComponent from "../../components/layout/navbar/Navbar";
import { Container, Row, Col, Card, Collapse } from "react-bootstrap";
import { CartIcon, UserIconCropped, MapIcon, OrderIcon, ChevronLeftIcon } from "../../assets/icons/IconsSet";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";
import AccontContent from "./accont/AccontContent";
import AdreassContent from "./address/AddressContent";


function Settings() {
    const { userData } = useContext(AuthContext);
    const [selectedCard, setSelectedCard] = useState(null);
    const contentRef = useRef(null);
    const [contentCardOpen, setcontentCardOpen] = useState(false);

    const CardOption = ({ icon, title, description, onClick }) => (
        <Card className="border-0 shadow mb-2 card-option" onClick={onClick}>
            <Card.Body>
                <Row className="g-0">
                    <Col className="col-auto me-3 d-flex align-items-center">
                        {icon}
                    </Col>

                    <Col className="lh-sm">
                        <span className="fw-bold text-muted">{title}</span>
                        <br />
                        <span className="text-muted small">{description}</span>
                    </Col>

                    <Col className="col-auto d-flex align-items-center">
                        <ChevronLeftIcon />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    const OptionsCards = () => (
        <>
            <Card className="shadow mb-4" >
                <Card.Body className="d-flex align-items-center">
                    <div className="rounded-circle overflow-hidden bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center me-3" style={{ width: '4em', height: '4em' }}>
                        <span style={{ fontSize: '2rem' }}>{userData ? userData.name.charAt(0).toUpperCase() : null}</span>
                    </div>

                    <div className="lh-sm">
                        <span style={{ fontSize: '1.2rem' }}>Bem Vindo, {userData ? userData.name : null}</span>
                        <br />
                        <span className="text-muted small">Aqui você pode ver e alterar seus dados</span>
                    </div>
                </Card.Body>
            </Card>

            <CardOption
                icon={<UserIconCropped />}
                title="Dados de Cadastro"
                description="Ver e alterar seus dados, seu e-mail e sua senha"
                onClick={() => handleCardClick('account')}
            />

            <CardOption
                icon={<MapIcon />}
                title="Endereços"
                description="Ver e alterar seus endereços"
                onClick={() => handleCardClick('adress')}
            />

            <CardOption
                icon={<OrderIcon />}
                title="Pedidos"
                description="Acompanhar entrega do produto"
                onClick={() => handleCardClick('order')}
            />

            <CardOption
                icon={<CartIcon size={22} />}
                title="Carrinho"
                description="Acompanhar seu carrinho"
                onClick={() => handleCardClick('cart')}
            />

            <CardOption
                icon={<CartIcon size={22} />}
                title="Cartões"
                description="Ver ou alterar meios de pagamento"
                onClick={() => handleCardClick('cart')}
            />
        </>
    );

    const handleCardClick = (cardType) => {
        setSelectedCard(cardType);
        renderContent(cardType);
    };

    const renderContent = (cardType) => {
        switch (cardType) {
            case 'account':
                contentRef.current = <AccontContent userData={userData} />;
                break;
            case 'adress':
                contentRef.current = <AdreassContent />
                break
            default:
                contentRef.current = null;
                break;
        }
    };


    return (
        <div>
            <NavbarComponent setNavbarContent={false} />
            <Row className="h-100 px-md-5 px-3 py-5" >
                <Col md={4}>
                    <OptionsCards />
                </Col>

                <Collapse in={contentCardOpen} className='d-lg-block'>
                    <Col md={8}>
                        <Card className="shadow">
                            <Card.Body>
                                {contentRef.current}
                            </Card.Body>
                        </Card>
                    </Col>
                </Collapse>
            </Row>
        </div>
    );
}

export default Settings;
