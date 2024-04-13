import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Row, Col, Button, Container } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, LoginIcon, AlertIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import { useLocation } from "react-router-dom";
import { AuthContext } from '../../context/AuthProvider.jsx'
import AuthServices from '../../services/auth/AuthServices';
import { useNavigate } from "react-router-dom";

function LoginPage() {
  
  const { isLoggedIn, navigate } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [ isLoggedIn ]);


    return (
      <div className='vh-100 bg-main'>
        <Container className='h-100 d-flex align-items-center justify-content-center'>
          <Card className='shadow' style={{ width: '45rem' }}>
            <Row className='g-0'>
              <Col md={7} className='px-md-4 py-md-5 px-3 py-4'>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <h4><LoginIcon currentColor='c00d0d' /> Acesse sua conta</h4>
                    <img className="d-md-none ms-auto mb-3" src={logo} alt="Logo Baterias Jupiter" width="100px" />
                  </div>
                  <LoginForm />
                </Card.Body>
              </Col>
              <Col md={5} className='d-none d-md-flex align-items-center bg-yellow rounded-end'>
                <img src={logoBgWhite} alt="Logo Baterias jupiter" width='100%' />
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    );

}




function LoginForm() {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const location = useLocation();
  const { errorMessages, setErrorMessages, login } = AuthServices();
  const [prevFormDataLogin, setPrevFormDataLogin] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(prevFormDataLogin) === JSON.stringify({ email: emailLogin, password: passwordLogin }) && !errorMessages.severError) {
      setErrorMessages(prevErrors => ({ ...prevErrors, general: 'Os dados não foram alterados.' }));
      return;
    }
    await login(emailLogin, passwordLogin);
    setPrevFormDataLogin({ email: emailLogin, password: passwordLogin });
  }


  useEffect(() => {
    if (location.state && location.state.email) {
      setEmailLogin(location.state.email);
    }
  }, [location.state]);

  return (
    <>
      {errorMessages.general || errorMessages.severError ? (
        <div className='msg alert alert-danger mb-0'>
          <AlertIcon size={"16"} currentColor={"#74373e"} />
          <span className='ms-2'>
            {errorMessages.general ? errorMessages.general : errorMessages.severError}
          </span>
        </div>
      ) : null}

      <Form onSubmit={handleSubmit}>
        <Form.Label className='mt-3 w-100' htmlFor='emailLogin'>Endereço de E-mail</Form.Label>
        <FormGroupWithIcon
          bgBorder={true}
          value={emailLogin}
          onChange={(e) => setEmailLogin(e.target.value)}
          icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
          type='email' placeholder='exemplo@gmail.com' mb={'mb-3'}
          feedback={errorMessages.email}
        />

        <Form.Label htmlFor='passwordLogin' className='w-100'>Senha</Form.Label>
        <FormGroupWithIcon
          bgBorder={true}
          value={passwordLogin}
          onChange={(e) => setPasswordLogin(e.target.value)}
          icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
          type='password' placeholder='•••••••••'
          feedback={errorMessages.password}
        />
        <a type='button' className='text-muted small'>Esqueceu sua Senha?</a>
        <div className='d-flex justify-content-center mt-5'>
          <Button variant='red' className='flex-grow-1' type='submit'>Entrar</Button>
        </div>
      </Form>
    </>
  );
}

export default LoginPage;
