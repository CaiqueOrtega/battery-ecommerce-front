import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Form, Dropdown, NavItem, NavLink, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { SearchIcon, CartIcon, UserCircleIcon, CaretUpIcon, UserCircleOutlineIcon, ExitIcon, ChevronLeftIcon, OrderIcon, MapIcon, UndrawProfile, ControlIcon, LockIconOutline } from '../../../assets/icons/IconsSet';
import logo from '../../../assets/images/logo.png';
import LoginSignUpButton from '../../common/LoginSignUpButton';
import './navbar.css';
import { AuthContext } from '../../../context/AuthProvider';
import { Link } from 'react-router-dom';
import ModalLogout from '../../common/ModalLogout';
import { BatteryCartContext } from '../../../context/BatteryCartProvider';
import exemploImageCart from '../../../assets/images/exemploImageRegister.png'


function NavbarComponent({ setNavbarContent }) {
  const { navigate } = useContext(AuthContext);
  const { logout, userData, isLoggedIn, VerifyAuth } = useContext(AuthContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const navbarContent = () => {
    return (
      <>
        <Col md={6} className='order-last order-md-0 mt-3 mt-md-0'>
          <form className="position-relative">
            <Form.Control className="py-2 input-search-size" type="text" placeholder="Pesquise rapidamente a bateria ideal e energize..." />
            <a type="button" className="position-absolute top-50 end-0 translate-middle-y bg-white border-start ps-2 me-2">
              <SearchIcon currentColor={"c00d0d"} size={"28"} />
            </a>
          </form>
        </Col>

        <Col className='col-auto d-flex order-md-0 order-first '>


          <RenderCartDropdownMenu userData={userData} isLoggedIn={isLoggedIn} />
          <RenderUserDropdownMenu userData={userData} isLoggedIn={isLoggedIn} VerifyAuth={VerifyAuth} setShowLogoutModal={setShowLogoutModal} />
          <Navbar.Toggle className="border-0 ms-1 me-md-3" aria-controls="navbarContent" />
        </Col>
      </>
    )
  };

  return (
    <>

      <Navbar expand="lg" className="bg-yellow shadow pb-0" variant="dark">
        <Row className="d-flex flex-fill pb-2 g-0 px-2 px-lg-4 align-items-center justify-content-between">
          <Col className='col-auto order-first ms-md-3'>
            <Navbar.Brand className='m-0'>
              <img src={logo} width="150px" alt="Logo" onClick={() => { navigate('/') }} />
            </Navbar.Brand>
          </Col>

          {setNavbarContent ? navbarContent() : null}

        </Row>


        <Navbar.Collapse id="navbarContent" className="flex-grow-0 order-last">
          <RenderMobileNavbarCollapseContent isLoggedIn={isLoggedIn} userData={userData} VerifyAuth={VerifyAuth} setShowLogoutModal={setShowLogoutModal} />
        </Navbar.Collapse>

      </Navbar >
      
      <ModalLogout showLogoutModal={showLogoutModal} setShowLogoutModal={setShowLogoutModal} logout={logout} />
    </>
  );
}



function RenderMobileNavbarCollapseContent({ isLoggedIn, userData, VerifyAuth, setShowLogoutModal }) {

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
        <Link to="/configuracoes" className='d-flex align-items-center mb-1 text-decoration-none text-dark'>
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
        <ListGroup  className='list-group-flush'>
          <ListGroup.Item action className='border-0'>
            <Link to="/#" className='d-flex align-items-center text-dark text-decoration-none '>
              <OrderIcon /> <span className='ms-2'>Pedidos</span>
            </Link>
          </ListGroup.Item >
          <ListGroup.Item action className='border-0'>
            <Link to="/#" className='d-flex align-items-center text-dark text-decoration-none'>
              <MapIcon /> <span className='ms-2'>Endereço</span>
            </Link>
          </ListGroup.Item>
          <VerifyAuth request={false}>
            <ListGroup.Item action className='border-0'>
              <Link to="/paineldecontrole" className='d-flex align-items-center text-decoration-none  text-dark'>
                <ControlIcon />
                <span className='ms-2'>Painel de controle</span>
              </Link>
            </ListGroup.Item>
          </VerifyAuth>
          <ListGroup.Item action className='border-0'>
            <Link to="/#" className='d-flex align-items-center text-decoration-none  text-dark'>
              <LockIconOutline currentColor={'a3a29f'} /> <span className='ms-2'>Segurança</span>
            </Link>
          </ListGroup.Item>
          <ListGroup.Item action className='text-danger border-0' onClick={() => setShowLogoutModal(true)}>
            <div className='d-flex align-items-center text-decoration-none '>
              <ExitIcon />  <span className='ms-2'>Sair da conta</span>
            </div>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </>
  )



  return (
    <Row className="d-lg-none mt-2 mobile-login p-0 g-0">
      {!isLoggedIn ? <NotLoggedContent /> : <LoggedContent />}
    </Row>
  )
}






function RenderCartDropdownMenu({ isLoggedIn }) {
  const { batteryCart } = useContext(BatteryCartContext);


  const CartEmptyDropdownMenu = () => (
    <Dropdown.Menu className="dropdown-menu-size rounded-4 shadow border-0 dropdown-menu-end mt-2 py-5 px-4 text-center">
      <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
      <h5 className='text-muted '>Seu Carrinho esta Vazio</h5>
    </Dropdown.Menu>
  );


  const CartDropdownMenu = () => (
    <Dropdown.Menu className="dropdown-menu-cart-size rounded-4 shadow border-0 dropdown-menu-end mt-2 py-3 px-4">
      <CaretUpIcon className="position-absolute caret-menuDropdown-position" />
      {Object.keys(batteryCart).length === 0 ? (
        <h5 className="text-center text-muted">Seu carrinho está vazio</h5>
      ) : (
        <>
          <h6 className='text-muted fw-bold text-center mb-0'>Meu Carrinho</h6>
          <Dropdown.Divider />
          <section className='battery-cart-dropdown'>
            {batteryCart.batteries.map(item => (
              <div key={item.cart_battery_id} className="mb-3 d-flex align-items-center">
                <img src={exemploImageCart} height={60} className="mr-3" />
                <div className='ms-3 lh-md flex-fill'>
                  <h6 className="fw-bold mb-0 text-wrap">{item.battery.name.length > 47 ? item.battery.name.substring(0, 47) + "..." : item.battery.name}</h6>
                  <div className="d-flex justify-content-between w-100">
                    <span className="small text-muted">Quantidade: {item.quantity}</span>
                    <span className="ms-auto small">R$ {item.battery.value.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            ))}
          </section>
          <Dropdown.Divider />

          <section className='d-flex justify-content-between  align-items-center py-2'>
            <div>Total:
              <span className='fw-bold'> R$ {batteryCart.totalValue.toFixed(2)}</span>
            </div>

            <Button variant='red btn-sm fw-bold'>Ver Carrinho</Button>
          </section>
        </>
      )

      }
    </Dropdown.Menu >
  );

  return (
    <Dropdown as={NavItem} className="dropdown-no-caret  text-white hover-color-red">
      <Dropdown.Toggle as={NavLink} className='me-3'>
        <CartIcon strokeWidth={'0.2'} size={30} />
      </Dropdown.Toggle>
      {!batteryCart ? <CartEmptyDropdownMenu /> : <CartDropdownMenu />}

    </Dropdown>
  );
}




function RenderUserDropdownMenu({ userData, isLoggedIn, VerifyAuth, setShowLogoutModal }) {



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

        <Dropdown.Menu className='shadow dropdown-menu-end border-0 mt-2 ' style={{ width: '14em' }}>
          <CaretUpIcon className="position-absolute caret-menuDropdown-position" />

          <Link to="/configuracoes" className='d-flex align-items-center mb-1 dropdown-item'>
            <div className="rounded-circle bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center rounded-circle-navbar ">
              <span>{userData.initials}</span>
            </div>

            <div className='ms-2 d-flex flex-column lh-sm' >
              <span className='fw-semibold '>{userData.name ? userData.name : 'carregando...'}</span>
              <span className='small text-muted'>Minha Conta <ChevronLeftIcon size={'13px'} /> </span>
            </div>
          </Link>
          <Dropdown.Divider className='mx-3' />

          <Dropdown.Item className='d-flex align-items-center mb-1'>
            <OrderIcon /> <span className='ms-2'>Pedidos</span>
          </Dropdown.Item >
          <Dropdown.Item className='d-flex align-items-center mb-1'>
            <MapIcon /> <span className='ms-2'>Endereço</span>
          </Dropdown.Item>
          <VerifyAuth request={false}>
            <Link to="/paineldecontrole" className='dropdown-item d-flex align-items-center' >
              <ControlIcon />
              <span className='ms-2'>Painel de controle</span></Link>
          </VerifyAuth>
          <Dropdown.Item className='d-flex align-items-center mb-1'>
            <LockIconOutline currentColor={'a3a29f'} /> <span className='ms-2'>Segurança</span>
          </Dropdown.Item>
          <Dropdown.Divider className='mx-3' />
          <Dropdown.Item className='text-danger d-flex align-items-center' onClick={() => setShowLogoutModal(true)}>
            <ExitIcon />  <span className='ms-2'>Sair da conta</span>
          </Dropdown.Item>
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
