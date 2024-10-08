import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Form, Dropdown, NavItem, NavLink, Row, Col, Button, ListGroup, DropdownToggle } from 'react-bootstrap';
import {CartIcon, UserCircleIcon, CaretUpIcon, UserCircleOutlineIcon, ExitIcon, ChevronLeftIcon, OrderIcon, MapIcon, UndrawProfile, ControlIcon, LockIconOutline } from '../../../../assets/icons/IconsSet'

import LoginSignUpButton from '../../../../components/common/LoginSignUpButton';
import ModalLogout from '../../../../components/common/ModalLogout';

import { useAuthProvider } from '../../../../context/AuthProvider';
import { useGlobalDataProvider } from '../../../../context/GlobalDataProvider';
import exemploImageCart from '../../../../assets/images/exemploImageRegister.png'
import logo from '../../../../assets/images/logo.png'
import NavbarSearch from '../../../batterySearch/BatterySearchPage';
import './navbar.css';


function NavbarComponent({ showNavbarSearch, isCartPage }) {
  const { logout, userData, isLoggedIn, navigate, VerifyAuth } = useAuthProvider()
  const { batteriesActive, batteryCart, batteryCartIsLoaded } = useGlobalDataProvider();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  console.log(batteryCart)

  const renderLinksDropDown = () => (
    <>
      <Dropdown.Item as={Link} to="/configuracoes/pedidos" className="d-flex align-items-center mb-1">
        <OrderIcon /> <span className="ms-2">Pedidos</span>
      </Dropdown.Item>

      <Dropdown.Item as={Link} to="/configuracoes/enderecos" className="d-flex align-items-center mb-1">
        <MapIcon /> <span className="ms-2">Endereço</span>
      </Dropdown.Item>

      <VerifyAuth>
        <Dropdown.Item as={Link} to="/paineldecontrole" className="d-flex align-items-center mb-1">
          <ControlIcon />
          <span className="ms-2">Painel de controle</span>
        </Dropdown.Item>
      </VerifyAuth>

      <Dropdown.Item as={Link} to="/configuracoes/seguranca" className="d-flex align-items-center mb-1">
        <LockIconOutline currentColor={'a3a29f'} /> <span className="ms-2">Segurança</span>
      </Dropdown.Item>
      <Dropdown.Divider className="mx-3" />
      <Dropdown.Item className="text-danger d-flex align-items-center" onClick={() => setShowLogoutModal(true)}>
        <ExitIcon /> <span className="ms-2">Sair da conta</span>
      </Dropdown.Item>
    </>
  );


  return (
    <>
      <Navbar expand="lg" className="bg-yellow shadow pb-0" variant="dark">
        <Row className="d-flex flex-fill pb-2 g-0 px-2 px-lg-4 align-items-center justify-content-between">
          <Col className='col-auto order-first ms-md-3'>
            <Navbar.Brand className='m-0 navbar-brand-image'>
              <img className="logo-navbar" src={logo} width="150px" alt="Logo" onClick={() => { navigate('/') }} />
            </Navbar.Brand>
          </Col>

          {showNavbarSearch ? <NavbarSearch batteriesActive={batteriesActive} navigate={navigate} /> : null}

          <Col className='col-auto d-flex order-md-0 order-first '>
            <RenderCartDropdownMenu 
            userData={userData} 
            isLoggedIn={isLoggedIn} 
            isCartPage={isCartPage} 
            batteryCartIsLoaded={batteryCartIsLoaded}
            batteryCart={batteryCart} 
            />

            <RenderUserDropdownMenu
              userData={userData}
              isLoggedIn={isLoggedIn}
              VerifyAuth={VerifyAuth}
              setShowLogoutModal={setShowLogoutModal}
              renderLinksDropDown={renderLinksDropDown}
            />

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
          </Col>
        </Row>
        <Navbar.Collapse id="navbarContent" className="flex-grow-0 order-last">
          <RenderMobileNavbarCollapseContent
            isLoggedIn={isLoggedIn}
            userData={userData}
            renderLinksDropDown={renderLinksDropDown}
          />
        </Navbar.Collapse>
      </Navbar >

      <ModalLogout
        showLogoutModal={showLogoutModal}
        setShowLogoutModal={setShowLogoutModal}
        logout={logout} />
    </>
  );
}



function RenderMobileNavbarCollapseContent({ isLoggedIn, userData, renderLinksDropDown }) {

  const NotLoggedContent = () => (
    <section className="px-4 pb-3">
      <Col xs={12} className="d-flex align-items-center">
        <UserCircleOutlineIcon />

        <div className="text-white ms-3 mt-3">
          <span className="fw-bold">Entre ou se Cadastre</span>
          <p className="lh-sm fw-semibold small">Confira seus pedidos ao fazer login na sua conta</p>
        </div>

      </Col>
      <Col className="d-flex mt-2 ">
        <LoginSignUpButton
          classNameBtnLogin="btn-red me-1 flex-fill px-4"
          classNameBtnSignUp="btn-red-outline bg-light flex-fill" />
      </Col>
    </section>

  )

  const LoggedContent = () => (
    <>
      <Col className='col-name-circle-mobile p-3 bg-white flex-fill '>
        <Link to="/configuracoes/minhaconta" className='d-flex align-items-center mb-1 text-decoration-none text-dark'>
          <div className="rounded-circle-navbar-collapse rounded-circle bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center ">
            <span>{userData.initials}</span>
          </div>

          <div className='ms-2 d-flex flex-column lh-sm' >
            <span className='fw-semibold'>{userData.name ? userData.name : 'carregando...'}</span>
            <span className='small text-muted'>Minha Conta <ChevronLeftIcon size={'13px'} /></span>
          </div>
        </Link>
      </Col>


      <Col className='p-3 bg-light '>
        {renderLinksDropDown()}
      </Col>
    </>
  )



  return (
    <Row className="d-lg-none mt-2 mobile-login p-0 g-0">
      {!isLoggedIn ? <NotLoggedContent /> : <LoggedContent />}
    </Row>
  )
}



function RenderCartDropdownMenu({ isCartPage, batteryCartIsLoaded, batteryCart  }) {
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const CartEmptyDropdownMenu = () => (
    <Dropdown.Menu className="dropdown-menu-size mt-2 rounded-4 shadow border-0 dropdown-menu-end mt-2 py-5 px-4 text-center">
      <CaretUpIcon className="position-absolute caret-menuDropdown-position-cart-empty" />
      <h5 className='text-muted '>Seu Carrinho esta Vazio</h5>
    </Dropdown.Menu>
  );

  const CartDropdownMenu = () => (
    <Dropdown.Menu className="dropdown-menu-cart-size rounded-4 shadow border-0 dropdown-menu-end mt-3 py-3">
      <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
      <h6 className='text-muted fw-bold text-center mb-0'>Meu Carrinho</h6>
      <Dropdown.Divider className='mb-0'/>
      <section className='battery-cart-dropdown custom-scrollbar p-3'>
        {batteryCart.batteries.map(item => (
          <div key={item.cart_battery_id} className="mb-3 d-flex align-items-center">
            <img src={exemploImageCart} height={60} className="mr-3" />
            <div className='ms-3 lh-md flex-fill'>
              <h6 className="fw-bold mb-0 text-wrap">{item.battery.name.length > 47 ? item.battery.name.substring(0, 47) + "..." : item.battery.name}</h6>
              <div className="d-flex justify-content-between w-100">
                <span className="small text-muted">Quantidade: {item.quantity}</span>
                <span className="ms-auto small">R$ {item.battery.value.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        ))}
      </section>
      <Dropdown.Divider className='mt-0'/>
      <section className='d-flex justify-content-between  align-items-center py-2 px-3'>
        <div>Total:
          <span className='fw-bold'> R$ {batteryCart.totalValue.toFixed(2).replace('.', ',')}</span>
        </div>
        <Dropdown.Item as={Link} to="/meucarrinho" className='btn btn-red btn-sm fw-bold text-center rounded-2'
          style={{ width: 'unset' }}
        >Ver Carrinho</Dropdown.Item >
      </section>
    </Dropdown.Menu >
  );

  return (
    <NavItem className="dropdown-no-caret  text-white hover-color-red">
      <Dropdown>
        {isScreenSmall || isCartPage ? (
          <Dropdown.Toggle as={Link} to="/meucarrinho" className='me-3 text-decoration-none text-white'>
            <CartIcon strokeWidth={'0.2'} size={30} />
            <span className="position-absolute top-0  translate-middle badge rounded-pill bg-red custom-font-size">
              {batteryCartIsLoaded && batteryCart?.batteries?.length > 0 && batteryCart?.batteries?.length}
            </span>
          </Dropdown.Toggle>
        ) : (
          <>
            <Dropdown.Toggle as={NavLink} className='me-3'>
              <CartIcon strokeWidth={'0.2'} size={30} />
              <span className="position-absolute top-0  translate-middle badge rounded-pill bg-red custom-font-size ">
                {batteryCartIsLoaded && batteryCart?.batteries?.length > 0 && batteryCart?.batteries?.length} 
              </span>
            </Dropdown.Toggle>
            {batteryCartIsLoaded && batteryCart?.batteries?.length > 0 ? <CartDropdownMenu /> : <CartEmptyDropdownMenu />}
          </>
        )}
      </Dropdown>
    </NavItem>
  );
}


function RenderUserDropdownMenu({ userData, isLoggedIn, renderLinksDropDown }) {

  const UserNotLoggedDropdown = () => (
    <>
      <Dropdown.Toggle as={NavLink} className="lh-1 fw-semibold text-white hover-color-red me-3">
        <UserCircleIcon className="float-start me-1" />
        Entre ou se <br /> Cadastre
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu-end  dropdown-menu-size shadow border-0 mt-2 p-4">
        <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
        <p className="fw-lighter lh-sm small text-muted mt-2 mb-4">Confira seus pedidos e desfrute de uma experiência exclusiva ao fazer login na sua conta!</p>
        <LoginSignUpButton
          classNameBtnLogin="btn-yellow d-block mb-2"
          classNameBtnSignUp="btn-red-outline d-block mb-2" />
      </Dropdown.Menu>
    </>
  )

  const UserLoggedDropdown = () => {

    return (
      <>
        <Dropdown.Toggle as={NavLink} className="lh-1 fw-semibold text-white hover-color-red me-3">
          <UndrawProfile size={'40'} />
          {userData.name.includes(' ') ? userData.name.split(' ')[0].slice(0, 12) : userData.name.slice(0, 12)}
        </Dropdown.Toggle>

        <Dropdown.Menu className='shadow dropdown-menu-end border-0 m ' style={{ width: '14em' }}>
          <CaretUpIcon className="position-absolute caret-menuDropdown-position" />

          <Dropdown.Item as={Link} to="/configuracoes/minhaconta" className='d-flex align-items-center mb-1 dropdown-item'>
            <div className="rounded-circle bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center rounded-circle-navbar ">
              <span>{userData.initials}</span>
            </div>

            <div className='ms-2 d-flex flex-column lh-sm' >
              <span className='fw-semibold '>{userData.name ? userData.name : 'carregando...'}</span>
              <span className='small text-muted'>Minha Conta <ChevronLeftIcon size={'13px'} /> </span>
            </div>
          </Dropdown.Item >
          <Dropdown.Divider className='mx-3' />
          {renderLinksDropDown()}

        </Dropdown.Menu>

      </>
    )
  }

  return (
    <>
      <Dropdown as={NavItem} className="d-none d-lg-block ">
        {!isLoggedIn ? <UserNotLoggedDropdown /> : <UserLoggedDropdown />}
      </Dropdown>
    </>
  )

}

export default NavbarComponent;
