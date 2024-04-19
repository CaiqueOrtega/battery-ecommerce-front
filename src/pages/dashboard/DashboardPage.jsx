import React, { useContext, useEffect, useState } from 'react';
import { Collapse, Navbar, Row, Col, Form, InputGroup, Dropdown, NavItem, NavLink, ListGroup } from 'react-bootstrap';
import { SearchIcon, BellIcon, UserIcon, AtomIcon, UserIconCropped, StatisticsIcon, DeliveryIcon, PromotionIcon } from '../../assets/icons/IconsSet';
import BatteryIndex from '../battery/BatteryIndex';
import UserIndex from '../user/UserIndex';
import logo from '../../assets/images/logo.png';
import './dashboard.css';
import { AuthContext } from '../../context/AuthProvider'    
import ModalLogout from '../../components/common/ModalLogout';
import AuthServices from '../../services/auth/AuthServices';
import { Link } from 'react-router-dom';

function VerifyAuth({ children }) {
    const { isLoggedIn, userData, isContextLoaded } = useContext(AuthContext);
    const { userRoleAuthorization } = AuthServices();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {

            const response = await userRoleAuthorization(userData, true);
            setLoading(false);

        }

        fetchData();

    }, [userData, isContextLoaded]);

    return loading ? null : children;
}


function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState("Controle Baterias");

    return (
        <VerifyAuth>
            <div className="d-flex flex-column vh-100 bg-main">
                <NavbarContent toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <Row className='g-0 flex-grow-1 overflow-hidden'>
                    <Collapse in={sidebarOpen} className='d-lg-block'>
                        <Col xs={12} lg={2} id='sidebarDashboard' className='shadow py-lg-5 px-2 bg-white'>
                            <SidebarContent onItemClick={setSidebarSelectedOption} selectedOption={sidebarSelectedOption} />
                        </Col>
                    </Collapse>


                    <Col className='d-flex h-100 overflow-auto px-5 py-4'>
                        <MainContent sidebarSelectedOption={sidebarSelectedOption} />
                    </Col>
                </Row>
            </div>
        </VerifyAuth>
    );

}

function NavbarContent({ toggleSidebar }) {
    return (
        <Navbar collapseOnSelect expand='lg' bg='white' className='shadow-sm'>
            <Row className='flex-fill d-flex align-items-center px-lg-4 px-2 g-0'>
                <Col className='col-auto order-first'>
                    <Navbar.Brand>
                        <img src={logo} height={40} alt='Logo' />
                    </Navbar.Brand>
                </Col>
                <Col md={4} className='mt-3 mt-md-0'>
                    <SearchForm />
                </Col>
                <Col className='col-auto ms-auto d-flex order-md-0 order-first align-items-center'>
                    <NotificationsDropdown />
                    <div className='vr my-2'></div>
                    <UserDropdown />
                    <a type='button' className="navbar-toggler-icon d-lg-none ms-2" onClick={toggleSidebar}></a>
                </Col>
            </Row>
        </Navbar>
    );
}

function SearchForm() {
    return (
        <Form className='d-flex order-last order-md-0'>
            <InputGroup>
                <Form.Control type='text' className='form-control-sm' placeholder='Pesquise rapidamente...' />
                <InputGroup.Text className='bg-red'>
                    <SearchIcon currentColor={'fff'} size={'22'} />
                </InputGroup.Text>
            </InputGroup>
        </Form>
    );
}

function NotificationsDropdown() {
    return (
        <Dropdown as={NavItem} className='dropdown-no-carret me-3'>
            <Dropdown.Toggle as={NavLink}>
                <BellIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu className='shadow shadow dropdown-menu-end'>
            </Dropdown.Menu>
        </Dropdown>
    );
}

function UserDropdown() {
    const { logout, userData } = useContext(AuthContext);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <>
            <Dropdown as={NavItem} className='dropdown-no-carret ms-1'>
                <Dropdown.Toggle as={NavLink} className='d-flex align-items-center'>
                    <UserIcon currentColor={'f11100'} size={'20'} />
                    <span className='ms-1 d-none d-md-block'>{userData.name.length > 7 ? `${userData.name.slice(0, 7)}...` : userData.name}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='shadow dropdown-menu-end '>
                    <Dropdown.Item>Minha Conta</Dropdown.Item>
                    <Dropdown.Item>Configurações</Dropdown.Item>
                    <Link to="/" className='dropdown-item d-flex align-items-center' >
                        <span className='ms-2'>Home</span></Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setShowLogoutModal(true)}>Sair</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <ModalLogout showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} logout={logout} />
        </>

    );

}

function SidebarContent({ onItemClick, selectedOption }) {
    const sidebarItems = [
        { icon: <AtomIcon />, text: 'Controle Baterias' },
        { icon: <UserIconCropped />, text: 'Usuários' },
        { icon: <PromotionIcon />, text: 'Promoções' },
        { icon: <StatisticsIcon />, text: 'Vendas' },
        { icon: <DeliveryIcon />, text: 'Entregas' }
    ];

    return (
        <ListGroup className='list-group-flush flex-grow-1'>
            {sidebarItems.map((item, index) => (
                <ListGroup.Item
                    key={index}
                    type="button"
                    className={`py-2 list-group-item-action ${selectedOption === item.text ? 'active' : ''}`}
                    onClick={() => onItemClick(item.text)}
                >
                    <i className='me-2 color-red'>{item.icon}</i> {item.text}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

function MainContent({ sidebarSelectedOption }) {
    let content = null;
    switch (sidebarSelectedOption) {
        case "Controle Baterias":
            content = <BatteryIndex />;
            break;
        case 'Usuários':
            content = <UserIndex />
            break;
        default:
            content = null;
    }

    return (
        <main className='flex-fill '>
            {content}
        </main>
    );
}

export default DashboardPage;
