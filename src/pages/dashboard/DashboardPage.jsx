import React, { useContext, useEffect, useState } from 'react';
import { Collapse, Navbar, Row, Col, Form, InputGroup, Dropdown, NavItem, NavLink, ListGroup } from 'react-bootstrap';
import { SearchIcon, CaretUpIcon, ExitIcon, BellIcon, UserIcon, AtomIcon, UserIconCropped, StatisticsIcon, DeliveryIcon, PromotionIcon, HomeIcon, GearIcon } from '../../assets/icons/IconsSet';
import logo from '../../assets/images/logo.png';
import './dashboard.css';
import { DashBoardContext } from '../../context/DashBoardProvider';
import ModalLogout from '../../components/common/ModalLogout';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import DashboardMainContent from './DashBoardMainContent';

function DashboardPage() {
    const {setContent, setUpdateContent} = useContext(DashBoardContext); 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [contentHasBeenSet, setContentHasBeenSet] = useState({});
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState(() => {
        return localStorage.getItem('selectedOption') || 'Controle Baterias';
    });

    useEffect(() => {
        setUpdateContent(sidebarSelectedOption);
        localStorage.setItem('selectedOption', sidebarSelectedOption);

        if (!contentHasBeenSet[sidebarSelectedOption]) {
            setContentHasBeenSet(prevState => ({ ...prevState, [sidebarSelectedOption]: true }));
            setContent(sidebarSelectedOption);
        }
    }, [sidebarSelectedOption]);



    return (
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
                    <span className='ms-1 d-none d-md-block'>  {userData && userData.name ?
                        (userData.name.length > 7 ? `${userData.name.slice(0, 7)}...` : userData.name)
                        : 'Usuário'
                    }</span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='shadow dropdown-menu-end border-0 mt-2 px-2'>
                    <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
                    <Dropdown.Item className='d-flex align-items-center mb-1'>
                        <UserIconCropped /> <span className='ms-2'>Minha Conta</span>
                    </Dropdown.Item>
                    <Dropdown.Item className='d-flex align-items-center mb-1'>
                        <GearIcon /> <span className='ms-2'>Configurações</span>
                    </Dropdown.Item>
                    <Link to="/" className='dropdown-item d-flex align-items-center' >
                        <HomeIcon /> <span className='ms-2'>Home</span>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => setShowLogoutModal(true)}>
                        <ExitIcon />  <span className='ms-2'>Sair da conta</span>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <ModalLogout showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} logout={logout} />
        </>

    );

}

function SidebarContent({ onItemClick, selectedOption }) {
    const sidebarItems = [
        { icon: <AtomIcon />, text: 'Baterias' },
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
    return (
        <main className='flex-fill '>
            <DashboardMainContent selectedOption={sidebarSelectedOption} />
        </main>
    );
}


export default DashboardPage;
