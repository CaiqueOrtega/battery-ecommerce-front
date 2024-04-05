import React, { useState } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, LoginIcon, AlertIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import ApiAuthentication from '../../services/ApiAuthentication';
import { decodeToken } from 'react-jwt';

function LoginPage() {
  return (
    <div className='container vh-100 d-flex align-items-center justify-content-center'>
      <Card className='shadow' style={{ width: '45rem' }}>
        <Row className='g-0'>
          <Col md={7} className='p-md-5 px-3 py-4'>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <h4><LoginIcon currentColor='c00d0d' /> Acesse sua conta</h4>
                <img className="d-md-none mb-3 ms-auto" src={logo} alt="Logo Baterias Jupiter" width="100px" />
              </div>
              <div className="msg"></div>
              <LoginForm />
            </Card.Body>
          </Col>
          <Col md={5} className='d-none d-md-flex align-items-center bg-yellow rounded-end'>
            <img src={logoBgWhite} alt="Logo Baterias jupiter" width='100%' />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Form>
      <Form.Label htmlFor='emailLogin'>Endereço de E-mail</Form.Label>
      <FormGroupWithIcon value={email} onChange={(e) => setEmail(e.target.value)} icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='email' placeholder='exemplo@gmail.com' mb='3' />
      <Form.Label htmlFor='passwordLogin'>Senha</Form.Label>
      <FormGroupWithIcon value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='password' placeholder='•••••••••' />
      <a type='button' className='text-muted small'>Esqueceu sua Senha?</a>
      <div className='d-flex justify-content-center'>
        <Button variant='red' className='flex-grow-1 mt-4' onClick={() => login(email, password)}>Entrar</Button>
      </div>
    </Form>
  );
}

async function login(emailLogin, passwordLogin) {
  try {
  
    const response = await ApiAuthentication.post('/login', {
      email: emailLogin,
      password: passwordLogin
    });

    if (response.status == 200) {
      descriptedToken(response.data.token)
    }
  } catch (error) {
    const msgElement = document.querySelector('.msg');
    msgElement.innerHTML = 
    `<span>${AlertIcon()}</span>
    <span>${error.response.data.message}</span>`; 
  msgElement.classList.add('alert', 'alert-danger');
  }
}

function descriptedToken(tokenJWT) {
  const decodedToken = decodeToken(tokenJWT);
  console.log(decodedToken);
}

export default LoginPage;
