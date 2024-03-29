import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../../public/images/logoBgWhite.png';
import logo from '../../../public/images/logo.png';

function SignUpPage() {
    return (
        <div className="container vh-100 d-flex align-items-center justify-content-center">
            <Card className='shadow' style={{ width: '48rem' }}>
                <Row className='g-0'>
                    <Col md={5} className='d-none d-md-flex align-items-center bg-yellow rounded-start'>
                        <img src={logoBgWhite} alt="Logo Baterias jupiter" width='100%' />
                    </Col>
                    <Col md={7} className='p-md-5 px-3 py-4'>
                        <Card.Body>
                            <div className="d-flex align-items-center mb-4">
                                <h4><SingUpIcon currentColor='c00d0d' /> Registre sua conta</h4>
                                <img className="d-md-none mb-3 ms-auto" src={logo} alt="Logo Baterias Jupiter" width="100px"  />
                            </div>
                            <SignUpForm />
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    );
}


function SignUpForm() {
    return (
        <Form>
            <FormGroupWithIcon icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='email' placeholder='E-mail' mb={'3'} />
            <FormGroupWithIcon icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'23'} />} type='text' placeholder='Nome Completo' mb={'3'} />
            <FormGroupWithIcon icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='text' placeholder='CPF' mb={'3'} />
            <FormGroupWithIcon icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='password' placeholder='Senha' mb={'3'} />
            <div className='d-flex justify-content-center'>
                <Button type='submit' variant='red' className='flex-grow-1 mt-4'>Cadastrar-se</Button>
            </div>
        </Form>
    );
}


export default SignUpPage;
