import { Card, Row, Col } from "react-bootstrap";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, GoogleMapsICon } from '../../../../assets/icons/IconsSet'
import logoMacDavis from '../../../../assets/images/logo-macDavis-motos.png'
import { Link } from "react-router-dom";
import logoAgilePay from '../../../../assets/images/AgilePay-60x60.png'
import logoBateriasJupiter from '../../../../assets/images/logo.png'
function FooterComponent() {
    const socialIcons = [
        { Icon: WhatsAppIcon, link: 'https://api.whatsapp.com/send?phone=5544999251012&text=Olá%2C+gostaria+de+saber+mais+sobre+as+baterias!' },
        { Icon: InstagramIcon, link: 'https://www.instagram.com/macdavismotos/?hl=pt' },
        { Icon: FacebookIcon, link: 'https://www.facebook.com/macdavis.motos/?locale=pt_BR' }
    ];

    return (
        <footer className="p-5 mt-5">

            <Card className="rounded-5 shadow" style={{ backgroundColor: '#262626' }}>
                <Card.Body className="position-relative mx-3 mt-1">
                    <Row className="py-4">
                        <Col xs={2} className="d-flex justify-content-start align-items-center">
                            <img src={logoMacDavis} alt="logo MacDavis motos" width={100} />
                        </Col>
                        <Col className="text-white d-flex   ">


                            <div className="small me-5">
                                <Link className="small text-light" to={'/termos'}>Termos e Condições</Link>

                                <p className="mt-2 small ">CNPJ: n.º 27.414.171/0001-13 |<a className="text-white text-decoration-none" href="https://www.google.com/maps?q=-23.66998215247412,-52.62926123361947" target="_blank" rel="noopener noreferrer"> <GoogleMapsICon /><span className="fw-bold ms-1" style={{ color: '#fc2f30' }}>Encontre a gente</span> no google maps</a></p>

                                <p className="small mb-0">Empresa Parceira <span className="fw-bold" style={{ color: '#fc2f30' }}>Baterias Jupiter</span></p>
                            </div>

                            <div className="ms-5 d-flex align-items-center">
                                <a className="text-white text-decoration-none d-flex align-items-center" href="https://www.instagram.com/agilepaydigital/?utm_source=ig_web_button_share_sheet" target="_blank" rel="noopener noreferrer" >
                                    <span className="text-white text-decoration-none rounded-circle d-flex justify-content-center align-items-center bg-white" style={{ width: '30px', height: '30px' }}><img src={logoAgilePay} alt="Logo AgilePay " width={20} /></span>
                                    <span className="ms-2 small">AgilePay</span>
                                </a>
                            </div>

                        </Col>

                        <Col xs={2} className="d-flex align-items-center justify-content-end">
                            {socialIcons.map(({ Icon, link }, index) => (
                                <SocialMediaIcon key={index} Icon={Icon} link={link} />
                            ))}
                        </Col>
                    </Row>
                    <div className="position-absolute small end-0 bottom-0 text-white me-3">
                        <span className="mt-2 small ">Copyright © 2024: <span className="ms-2"> A.O.BA | Alavarse Ortega BaseTech </span></span>
                    </div>
                </Card.Body>
            </Card>
        </footer>
    )
}

const SocialMediaIcon = ({ Icon, link }) => (
    <a type="button" className="text-white ms-2 rounded-circle d-flex justify-content-center align-items-center" target="_blank" rel="noopener noreferrer" href={link} style={{ width: '40px', height: '40px', backgroundColor: '#fc2f30' }}>
        <Icon />
    </a>
);

export default FooterComponent;