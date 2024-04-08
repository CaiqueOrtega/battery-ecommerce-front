import React, { useState } from 'react';
import { Card, Form, Row, Col, Button, Container } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, LoginIcon, AlertIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import ConnectionAPI from '../../services/ConnectionAPI';
import { decodeToken } from 'react-jwt';

function LoginPage() {
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const login = async (emailLogin, passwordLogin) => {
    try {
      const response = await ConnectionAPI.post('auth/login', {
        email: emailLogin,
        password: passwordLogin
      });
      descriptedToken(response.data.token);

    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage('Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.');
      }
    }
  };

  return (
    <>
      {errorMessage && (
        <div className='msg alert alert-danger mb-0'>
          <AlertIcon />
          {errorMessage}
        </div>
      )}
      <Form onSubmit={(e) => {
        e.preventDefault();
        login(email, password);
      }}>
        <Form.Label className='mt-3' htmlFor='emailLogin'>Endereço de E-mail</Form.Label>
        <FormGroupWithIcon value={email} onChange={(e) => setEmail(e.target.value)} icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='email' placeholder='exemplo@gmail.com' mb='3' />
        <Form.Label htmlFor='passwordLogin'>Senha</Form.Label>
        <FormGroupWithIcon value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='password' placeholder='•••••••••' />
        <a type='button' className='text-muted small'>Esqueceu sua Senha?</a>
        <div className='d-flex justify-content-center mt-5'>
          <Button variant='red' className='flex-grow-1' type='submit'>Entrar</Button>
        </div>
      </Form>
    </>
  );
}

function descriptedToken(tokenJWT) {
  const decodedToken = decodeToken(tokenJWT);
  console.log(decodedToken);
}

export default LoginPage;
