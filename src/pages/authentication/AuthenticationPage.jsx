import React, { useContext, useEffect, useState } from 'react';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider.jsx';
import SignUpForm from './signUp/SignUpForm.jsx';
import LoginForm from './login/LoginForm.jsx';
import { SingUpIcon, LoginIcon, AtomIcon } from '../../assets/icons/IconsSet.jsx';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import './authentication.css';

function AuthenticationPage() {
    const { action } = useParams();
    const { isLoggedIn, navigate } = useContext(AuthContext);
    const [showLoginForm, setShowLoginForm] = useState(action === 'entrar');
    const [showSignUpForm, setShowSignUpForm] = useState(action === 'cadastrar');
    const [animateImageColumn, setAnimateImageColumn] = useState(null);
    const [applyRightZero, setApplyRightZero] = useState(action === 'entrar');
    const [emailSingUp, setEmailSingUp] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);



    const handleToggleForm = ({ singUpEmail }) => {
        const newAction = action === 'entrar' ? 'cadastrar' : 'entrar';
        setApplyRightZero(false);

        if(singUpEmail){
            setEmailSingUp(singUpEmail);
        }

        navigate(`/autenticacao/${newAction}`);

        setAnimateImageColumn(newAction);

        newAction === 'entrar' ? setShowLoginForm(true) : setShowSignUpForm(true);

        const timeoutDuration = window.innerWidth < 768 ? 300 : 400;

        setTimeout(() => {
            if (newAction === 'entrar') {
                setShowSignUpForm(false)
            } else {
                setShowLoginForm(false)
            }
        }, timeoutDuration);
    };



    return (
        <div className='vh-100 bg-main'>
            <Container className='h-100 d-flex align-items-center justify-content-center container-authentication '>
                <Card className='shadow rounded-5 card-authentication border-0'>

                    <Row className='g-0 h-100'>
                        <Col md={6} className='d-flex align-items-md-center align-items-start position-relative col-form'>
                            {showLoginForm && (
                                <Card.Body className='px-5 py-4'>
                                    <div className="d-flex align-items-center mb-3">
                                        <h4><LoginIcon currentColor='c00d0d' /> Acesse sua conta</h4>
                                        <img className="d-md-none ms-auto mb-3" src={logo} alt="Logo Baterias Jupiter" width="100px" />
                                    </div>
                                    <LoginForm emailSingUp={emailSingUp}/>
                                </Card.Body>
                            )}
                        </Col>


                        <Col md={6} className='d-flex align-items-md-center align-items-end  position-relative col-form'>
                            {showSignUpForm && (
                                <Card.Body className='px-5 py-md-5 py-4'>
                                    <div className="d-flex align-items-center">
                                        <h4> <SingUpIcon currentColor='c00d0d' /> Registre uma conta</h4>
                                        <img className="d-md-none ms-auto mb-md-3" src={logo} alt="Logo Baterias Jupiter" width="100px" />
                                    </div>
                                    <SignUpForm handleToggleForm={handleToggleForm} />
                                </Card.Body>
                            )}
                        </Col>

                        <Col md={6} className={`col-image position-absolute d-flex flex-column bg-yellow
                         ${animateImageColumn !== null ? animateImageColumn === 'entrar' ? 'animate-image-column-left' : 'animate-image-column-right' : ''}
                         ${applyRightZero ? 'end-0 bottom-0 rounded-end-md-5' : 'rounded-start-md-5'}`}>



                            <div className="d-flex align-items-center justify-content-center flex-fill">
                                <img className='d-md-block d-none mt-5 pt-5' src={logoBgWhite} alt="Logo Baterias jupiter" width='100%' />
                                <AtomIcon className={'d-md-none text-white'} size={100} />
                            </div>
                            <div className="d-flex flex-column align-items-center pb-5">
                                <span className='fw-bold text-white fs-5 mb-2'>{action === 'entrar' ? 'Ainda não tem uma Conta?' : 'Já possui uma Conta?'}</span>
                                <Button variant='outline-light border-2 fw-bold ' onClick={handleToggleForm}>
                                    {showSignUpForm ? 'Registre-se' : 'Faça login'}
                                </Button>
                            </div>
                        </Col>


                    </Row>
                </Card>
            </Container>
        </div>
    );
}

export default AuthenticationPage;
