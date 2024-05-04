import React, { useMemo, useState } from "react";
import NavbarComponent from "../../components/layout/navbar/Navbar";
import { Container, Row, Col, Card, Collapse } from "react-bootstrap";
import { CartIcon, UserIconCropped, MapIcon, OrderIcon, ChevronLeftIcon } from "../../assets/icons/IconsSet";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";
import AccontContent from "./accont/AccontContent";
import AdressContent from "./address/AddressContent";
import './settings.css'

const CardOption = ({ icon, title, description, onClick }) => (
    <Card className="border-0 shadow mb-2 card-option " onClick={onClick}>
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

const OptionsCards = ({ handleCardClick, userDataName }) => (
    <>
        <Card className="shadow mb-4" >
            <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle overflow-hidden bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center me-3" style={{ width: '4em', height: '4em' }}>
                    <span style={{ fontSize: '2rem' }}>{userDataName ? userDataName.charAt(0).toUpperCase() : null}</span>
                </div>
                <div className="lh-sm">
                    <span style={{ fontSize: '1.2rem' }}>Bem Vindo, {userDataName ? userDataName : null}</span>
                    <br />
                    <span className="text-muted small">Aqui você pode ver e alterar seus dados</span>
                </div>
            </Card.Body>
        </Card>

        <CardOption
            icon={<UserIconCropped />}
            title="Dados de Cadastro"
            description="Ver e alterar seus dados"
            onClick={() => handleCardClick('account')}
        />

        <CardOption
            icon={<MapIcon />}
            title="Endereços"
            description="Ver e alterar seus endereços"
            onClick={() => handleCardClick('address')}
        />

        <CardOption
            icon={<OrderIcon />}
            title="Pedidos"
            description="Acompanhar entrega do produto"
            onClick={() => handleCardClick('order')}
        />

        <CardOption
            icon={<CartIcon size={22} />}
            title="Cartões"
            description="Ver ou alterar meios de pagamento"
            onClick={() => handleCardClick('cart')}
        />

        <CardOption
            icon={<CartIcon size={22} />}
            title="Voltar"
            description="Voltar a pagina Inicial"
        />
    </>
);

function Settings() {
    const { userData } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('account');
    const [mobileVisibleCard, setMobileVisibleCard] = useState(false);

    const getContent = useMemo(() => {
        switch (selectedOption) {
            case 'account':
                return <AccontContent userData={userData} />;
            case 'address':
                return <AdressContent />;
            default:
                return null;
        }
    }, [selectedOption]);

    return (
        <div className="vh-100 margin-top-navbar">
            <NavbarComponent setNavbarContent={false} />

            <div className="h-100 d-md-flex align-items-center">
                <Container >
                    <Row className="flex-md-row-reverse" >

                        <Col className={`d-md-block ${!mobileVisibleCard && 'd-none'} expanded-card testa`}>
                            <Card className="shadow card-main">
                                <Card.Body>
                                    <Container className="px-md-5 py-md-2 h-100">
                                        <a type="button" className="color-red d-md-none" onClick={() => setMobileVisibleCard(false)}>Voltar</a>
                                        {getContent}
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>


                        <Col md={4} className="mt-4 mt-md-0">
                            <OptionsCards handleCardClick={(optionCard) => {
                                setSelectedOption(optionCard)
                                setMobileVisibleCard(true);
                                }} userDataName={userData.name} />
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default Settings;
