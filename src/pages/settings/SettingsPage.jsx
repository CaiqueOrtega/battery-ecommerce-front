import { useMemo, useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { CartIcon, UserIconCropped, MapIcon, OrderIcon, ChevronLeftIcon, LockIconOutline, BsArrowLeft } from "../../assets/icons/IconsSet";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";
import AccountContent from "./account/AccountContent";
import AddressContent from "./address/AddressContent";
import './settings.css'
import { useParams } from "react-router-dom";



function SettingsPage() {
    const { userData, navigate } = useContext(AuthContext);
    const [mobileVisibleCard, setMobileVisibleCard] = useState(false);
    const { type } = useParams();
    const [selectedOption, setSelectedOption] = useState(type || sessionStorage.getItem('selectedOptionSettings') || 'minhaconta');


    useEffect(() => {
    
        if (selectedOption) {
            sessionStorage.setItem('selectedOptionSettings', selectedOption); 
            navigate(`configuracoes/${selectedOption || 'minhaconta'}`);
            console.log('entrou',selectedOption )
        }
    }, [selectedOption]);

    useEffect(() => {
        if (type && type !== selectedOption) {
            setSelectedOption(type);
        }
    }, [type]);

    const getContent = useMemo(() => {
        switch (selectedOption) {
            case 'minhaconta':
                return <AccountContent userData={userData} />;
            case 'enderecos':
                return <AddressContent />;
            default:
                return null;
        }
    }, [selectedOption]);

    return (
        <>
            <div className="d-flex flex-column h-100">
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <Container fluid={'lg'} className="h-sm-100 py-md-5">
                        <Row className="h-sm-100">
                            <Col md={4} className={`mt-4 mt-md-0 d-md-block ${mobileVisibleCard && 'd-none'}`} id="first-column">
                                <OptionsCards handleCardClick={(optionCard) => {
                                    setSelectedOption(optionCard)
                                    setMobileVisibleCard(true);
                                }}
                                    userDataName={userData?.name}
                                    userDataInitials={userData?.initials}
                                    navigate={navigate}
                                />
                            </Col>

                            <Col className={`d-md-block ${!mobileVisibleCard && 'd-none'} expanded-card`} >
                                <Card className="shadow card-main h-sm-100">
                                    <a type="button" className="color-red d-md-none position-absolute " onClick={() => setMobileVisibleCard(false)}>Voltar</a>
                                    {getContent}
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    );

}


const CardOption = ({ icon, title, description, disableArrowLeft, onClick }) => (
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
                    {!disableArrowLeft && <ChevronLeftIcon />}
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
            onClick={() => handleCardClick('minhaconta')}
        />

        <CardOption
            icon={<MapIcon />}
            title="Endereços"
            description="Ver e alterar seus endereços"
            onClick={() => handleCardClick('enderecos')}
        />

        <CardOption
            icon={<OrderIcon />}
            title="Pedidos"
            description="Acompanhar entrega do produto"
            onClick={() => handleCardClick('pedidos')}
        />

        <CardOption
            icon={<LockIconOutline size={22} />}
            title="Segurança"
            description="Ver e alterar medidas de segurança"
            onClick={() => handleCardClick('seguranca')}
        />

        <CardOption
            icon={<CartIcon size={22} />}
            title="Cartões"
            description="Ver ou alterar meios de pagamento"
            onClick={() => handleCardClick('cartoes')}
        />

        <CardOption
            icon={<BsArrowLeft currentColor={'currentColor'} size={'35px'} />}
            title="Voltar"
            description="voltar para pagina inicial"
            onClick={() => navigate('/')}
            disableArrowLeft={true}
        />

    </>
);

export default SettingsPage;