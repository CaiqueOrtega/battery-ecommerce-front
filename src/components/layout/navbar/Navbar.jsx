import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Form, Dropdown, NavItem, NavLink, Row, Col } from 'react-bootstrap';
import { SearchIcon, CartIcon, UserCircleIcon, CaretUpIcon, UserCircleOutlineIcon, ExitIcon, UserIconCropped, OrderIcon, MapIcon, GearIcon, ControlIcon } from '../../../assets/icons/IconsSet';
import logo from '../../../assets/images/logo.png';
import LoginSignupButton from '../../common/LoginSignupButton';
import './navbar.css';
import { AuthContext } from '../../../context/AuthProvider';
import AuthServices from '../../../services/auth/AuthServices';
import { Link } from 'react-router-dom';
import ModalLogout from '../../common/ModalLogout';

function VerifyAuth({ children }) {
  const { userData, isContextLoaded } = useContext(AuthContext);
  const { userRoleAuthorization } = AuthServices();
  const [auth, setAuth] = useState(true);

  useEffect(() => {
    async function fetchData() {

      const response = await userRoleAuthorization(userData);
      console.log(response);
      if (response == 200){
        setAuth(false);
      }

    }

    fetchData();  

  }, [userData, isContextLoaded]);

  return auth ? null : children;
}

function NavbarComponent() {

  const renderMobileLogin = () => (
    <div className="d-lg-none row mt-3">
      <div className="col-12 d-flex align-items-center">
        <UserCircleOutlineIcon />
        <div className="text-white ms-3">
          <span className="fw-bold">Entre ou se Cadastre</span>
          <p className="lh-sm fw-semibold small">Confira seus pedidos ao fazer login na sua conta</p>
        </div>
      </div>
      <div className="col d-flex mt-2 px-3">
        <LoginSignupButton
          classNameBtnLogin="btn-red me-1 flex-fill px-4"
          classNameBtnSignUp="btn-red-outline bg-light flex-fill" />
      </div>
    </div>
  );

  const renderCart = () => (
    <Dropdown as={NavItem} className="dropdown-no-carret text-white hover-color-red">
      <Dropdown.Toggle as={NavLink} className='me-3'>
        <CartIcon />
      </Dropdown.Toggle>
      <Dropdown.Menu className="rounded-4 shadow border-0 dropdown-menu-end dropdow-menu-size mt-2 py-5 px-4">
        <CaretUpIcon className="position-absolute carret-menuDropdow-possition" />
        <h5 className='text-muted '>Entre na sua conta, para ter acesso ao carrinho</h5>
      </Dropdown.Menu>
    </Dropdown>

  );

  return (
    <Navbar expand="lg" className="bg-yellow shadow mb-5" variant="dark">
      <Row className="d-flex flex-fill g-0 px-2 px-md-4 align-items-center justify-content-between">
        <Col className='col-auto order-first ms-md-3'>
          <Navbar.Brand className='m-0'>
            <img src={logo} width="170px" alt="Logo" />
          </Navbar.Brand>
        </Col>

        <Col md={6} className='order-last order-md-0 mt-3 mt-md-0'>
          <form className="position-relative">
            <Form.Control className="py-2 input-search-size" type="text" placeholder="Pesquise rapidamente a bateria ideal e energize..." />
            <a type="button" className="position-absolute top-50 end-0 translate-middle-y bg-white border-start ps-2 me-2">
              <SearchIcon currentColor={"f11100"} size={"28"} />
            </a>
          </form>
        </Col>

        <Col className='col-auto d-flex order-md-0 order-first '>

          {renderCart()}
          <RenderDropdown />

          <Navbar.Toggle className="border-0 ms-1" aria-controls="navbarContent" />
        </Col>

        <Navbar.Collapse id="navbarContent" className="flex-grow-0 order-last">
          {renderMobileLogin()}
        </Navbar.Collapse>

      </Row>
    </Navbar >
  );
}

function RenderDropdown() {
  const { logout, userData, isLoggedIn, isContextLoaded } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  if (isLoggedIn) {
    return (
      <>
        <Dropdown as={NavItem}>
          <Dropdown.Toggle as={NavLink} className="lh-1 fw-semibold text-white hover-color-red me-3">
            <UserCircleIcon className="float-start me-2" />
            Olá, {userData.name.length > 7 ? `${userData.name.slice(0, 7)}...` : userData.name}
            <br />
            Minha Conta

          </Dropdown.Toggle>
          <Dropdown.Menu className='shadow dropdown-menu-end border-0 mt-2 px-3'>
            <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
            <Dropdown.Item className='d-flex align-items-center mb-1'>
              <UserIconCropped /> <span className='ms-2'>Minha Conta</span>
            </Dropdown.Item>
            <Dropdown.Item className='d-flex align-items-center mb-1'>
              <GearIcon /> <span className='ms-2'>Configurações</span>
            </Dropdown.Item>
            <Dropdown.Item className='d-flex align-items-center mb-1'>
              <OrderIcon /> <span className='ms-2'>Pedidos</span>
            </Dropdown.Item >
            <Dropdown.Item className='d-flex align-items-center mb-1'>
              <MapIcon /> <span className='ms-2'>Endereço</span>
            </Dropdown.Item>
            <VerifyAuth>
              <Link to="/paineldecontrole" className='dropdown-item d-flex align-items-center' >
                <ControlIcon />
                <span className='ms-2'>Painel de Controle</span></Link>
            </VerifyAuth>
            <Dropdown.Divider />
            <Dropdown.Item className='text-danger d-flex align-items-center' onClick={() => setShowLogoutModal(true)}>
              <ExitIcon />  <span className='ms-2'>Sair da conta</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>


        <ModalLogout showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} logout={logout} />
      </>
    )
  } else {
    return (
      <Dropdown as={NavItem} className="d-none d-lg-block">
        <Dropdown.Toggle as={NavLink} className="lh-1 fw-semibold text-white hover-color-red me-3">
          <UserCircleIcon className="float-start me-1" />
          Entre ou se <br /> Cadastre
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu-end  dropdown-menu-size shadow border-0 mt-2 p-4">
          <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
          <p className="fw-lighter lh-sm small text-muted mt-2 mb-4">Confira seus pedidos e desfrute de uma experiência exclusiva ao fazer login na sua conta!</p>
          <LoginSignupButton
            classNameBtnLogin="btn-yellow d-block mb-2"
            classNameBtnSignUp="btn-red-outline d-block mb-2" />
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

export default NavbarComponent;
