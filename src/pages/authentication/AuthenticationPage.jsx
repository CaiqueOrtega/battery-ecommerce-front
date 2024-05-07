import { AuthContext } from '../../context/AuthProvider.jsx';
import React, { useContext, useEffect, useState } from 'react';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import SignUpForm from './signUp/SignUpForm.jsx';
import LoginForm from './login/LoginForm.jsx';
import './authentication.css';
import { SingUpIcon, LoginIcon } from '../../assets/icons/IconsSet.jsx';

function AuthenticationPage({ initialSide }) {
    const { isLoggedIn, navigate } = useContext(AuthContext);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [animateImageColumn, setAnimateImageColumn] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn]);

    const handleToggleForm = () => {
        setAnimateImageColumn(!animateImageColumn);

        animateImageColumn ? setShowLoginForm(true) : setShowSignUpForm(true);

        setTimeout(() => {
            if (animateImageColumn) {
                setShowSignUpForm(false);
            } else {
                setShowLoginForm(false);;
            }
        }, 500);
    };

    return (
        <div className='vh-100 bg-main'>
            <Container className='h-100 d-flex align-items-center justify-content-center'>
                <Card className='shadow rounded-4' style={{ width: '50rem', height: '33.5rem' }}>
                    <Row className='g-0 h-100'>
                        <Col md={6} className='d-flex align-items-center'>

                            {showLoginForm && (
                                <Card.Body className='px-md-5  px-3 py-4'>
                                    <div className="d-flex align-items-center mb-3">
                                        <h4><LoginIcon currentColor='c00d0d' /> Acesse sua conta</h4>
                                        <img className="d-md-none ms-auto mb-3" src={logo} alt="Logo Baterias Jupiter" width="100px" />
                                    </div>
                                    <LoginForm />
                                </Card.Body>
                            )}

                        </Col>
                        <Col md={6} className='d-md-flex d-none  align-items-center'>

                            <div className={`position-absolute h-100 z-3  d-flex flex-column bg-yellow rounded-end-4  ${animateImageColumn !== null ? animateImageColumn ? 'animate-image-column-left' : 'animate-image-column-right ' : ''}`}>


                                <div className="d-flex flex-column align-items-center justify-content-center mt-4 pt-5 flex-fill">
                                    <img src={logoBgWhite} alt="Logo Baterias jupiter" width='100%' />
                                </div>

                                <div className="d-flex flex-column align-items-center pb-4">
                                    <span className='fw-bold text-white fs-5 mb-2'>{animateImageColumn ? 'Ainda não tem uma Conta?' : 'Já possui uma Conta?'}</span>
                                    <Button variant='outline-light border-2 fw-bold' onClick={handleToggleForm}>{showLoginForm ? 'Registre-se' : 'Faça login'}</Button>
                                </div>
                            </div>

                            {showSignUpForm && (
                                <Card.Body className='mx-1 px-4 py-md-5 px-3 py-4' >
                                    <div className="d-flex align-items-center">
                                        <h4> <SingUpIcon currentColor='c00d0d' /> Registre uma conta</h4>
                                        <img className="d-md-none ms-auto mb-3" src={logo} alt="Logo Baterias Jupiter" width="100px" />
                                    </div>
                                    <SignUpForm />
                                </Card.Body>
                            )}
                        </Col>


                    </Row>
                </Card>
            </Container>
        </div>
    );
}


export default AuthenticationPage;
