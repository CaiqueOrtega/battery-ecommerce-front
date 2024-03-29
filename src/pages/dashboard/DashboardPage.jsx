import React, { useState } from 'react';
import './dashboard.css';
import logo from '../../../public/images/logo.png';

import { Collapse, Navbar, Row, Col, Form, InputGroup, Dropdown, NavItem, NavLink, ListGroup } from 'react-bootstrap';
import { SearchIcon, BellIcon, UserIcon, AtomIcon, UserIconCropped, StatisticsIcon, DeliveryIcon, PromotionIcon } from '../../assets/icons/IconsSet';


function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="d-flex flex-column vh-100 bg-main" >
            <NavbarContent toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <Row className='g-0 flex-grow-1 overflow-hidden'>
                    <Collapse in={sidebarOpen} className='d-lg-block'>
                        <Col xs={12} lg={2} id='sidebarDashboard' className='bg-white shadow py-lg-5 px-2'>
                            <SidebarContent />
                        </Col>
                    </Collapse>
                    <Col className='d-flex h-100 overflow-auto p-4'>
                        <MainContent />
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
    return (
        <Dropdown as={NavItem} className='dropdown-no-carret ms-1'>
            <Dropdown.Toggle as={NavLink} className='d-flex align-items-center'>
                <UserIcon currentColor={'f11100'} size={'20'} />
                <span className='ms-1 d-none d-md-block'>Caique</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className='shadow dropdown-menu-end '>
                <Dropdown.Item>Minha Conta</Dropdown.Item>
                <Dropdown.Item>Configurações</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>Sair</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}


function SidebarContent() {
    return (
        <ListGroup className='list-group-flush flex-grow-1'>
            <SidebarItem icon={<AtomIcon />} text='Controle Baterias' active={true} />
            <SidebarItem icon={<UserIconCropped />} text='Usuários' />
            <SidebarItem icon={<PromotionIcon />} text='Promoções' />
            <SidebarItem icon={<StatisticsIcon />} text='Vendas' />
            <SidebarItem icon={<DeliveryIcon />} text='Entregas' />
        </ListGroup>
    );
}


function SidebarItem({ icon, text, active = false }) {
    return (
        <ListGroup.Item type="button" className={`py-2 list-group-item-action ${active ? 'active' : ''}`}>
            <i className='me-2 color-red'>{icon}</i> {text}
        </ListGroup.Item>
    );
}

function MainContent() {
    return (
        <div>Main content
            
        </div>
    );
}

export default DashboardPage;
