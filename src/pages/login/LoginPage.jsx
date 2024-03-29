import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, LoginIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../../public/images/logoBgWhite.png';
import logo from '../../../public/images/logo.png';

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
  return (
    <Form>
      <Form.Label>Endereço de E-mail</Form.Label>
      <FormGroupWithIcon icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='email' placeholder='exemplo@gmail.com' mb='3' />
      <Form.Label>Senha</Form.Label>
      <FormGroupWithIcon icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='password' placeholder='•••••••••' />
      <a type='button' className='text-muted small'>Esqueceu sua Senha?</a>
      <div className='d-flex justify-content-center'>
        <Button type='submit' variant='red' className='flex-grow-1 mt-4'>Entrar</Button>
      </div>
    </Form>
  );
}

export default LoginPage;
