import { useMemo, useState, useEffect } from "react";
import NavbarComponent from "../../components/layout/navbar/Navbar";
import { Container, Row, Col, Card } from "react-bootstrap";
import { CartIcon, UserIconCropped, MapIcon, OrderIcon, ChevronLeftIcon } from "../../assets/icons/IconsSet";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";
import AccountContent from "./account/AccountContent";
import AddressContent from "./address/AddressContent";
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

const OptionsCards = ({ handleCardClick, userDataName, userDataInitials, navigate }) => (
    <>
        <Card className="shadow mb-4">
            <Card.Body className="d-flex align-items-center">
                <Row >
                    <Col xs={3} className="d-flex align-items-center justify-content-center p-0">
                        <div className="rounded-circle  bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center initial-circle">
                            <span className="initial-letter">{userDataInitials}</span>
                        </div>
                    </Col>
                    <Col xs={9} className="ps-2 p-0">
                        <div className="lh-sm">
                            <span className="initial-welcome">Bem Vindo, {userDataName ? userDataName : null}</span>
                            <br />
                            <span className="text-muted small">Aqui você pode ver e alterar seus dados</span>
                        </div>
                    </Col>
                </Row>
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
            onClick={() => navigate('/')}
        />
    </>
);

function SettingsPage() {
    const { userData, navigate } = useContext(AuthContext);
    const [selectedOption, setSelectedOption] = useState('account');
    const [mobileVisibleCard, setMobileVisibleCard] = useState(false);

    useEffect(() => {
        document.title = "Minha conta";
      }, []);

    const getContent = useMemo(() => {
        switch (selectedOption) {
            case 'account':
                return <AccountContent userData={userData} />;
            case 'address':
                return <AddressContent />;
            default:
                return null;
        }
    }, [selectedOption]);

    return (
        <>
            <div className="d-flex flex-column vh-100">
                <NavbarComponent setNavbarContent={false} />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <Container fluid={'lg'} className="h-sm-100 py-md-5">
                        <Row className="h-sm-100">
                            <Col md={4} className={`mt-4 mt-md-0 d-md-block ${mobileVisibleCard && 'd-none'}`}>
                                <OptionsCards handleCardClick={(optionCard) => {
                                        setSelectedOption(optionCard)
                                        setMobileVisibleCard(true);
                                    }}
                                    userDataName={userData?.name } 
                                    userDataInitials={userData?.initials}
                                    navigate={navigate}        
                                />
                            </Col>

                            <Col className={`d-md-block ${!mobileVisibleCard && 'd-none'} expanded-card`}>
                                <Card className="shadow card-main h-sm-100">
                                    <Card.Body>
                                        <Container className="px-md-5 py-md-2">
                                            <a type="button" className="color-red d-md-none" onClick={() => setMobileVisibleCard(false)}>Voltar</a>
                                            {getContent}
                                        </Container>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    );

}

export default SettingsPage;
