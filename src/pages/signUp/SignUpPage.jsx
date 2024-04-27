import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon, KeyIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import AuthServices from '../../services/auth/AuthServices';
import { useNavigate } from "react-router-dom";

function SignUpPage() {
    return (
        <div className="vh-100 bg-main">
            <Container className='h-100 d-flex align-items-center justify-content-center'>
                <Card className='shadow' style={{ width: '45rem' }}>
                    <Row className='g-0'>
                        <Col md={7} className='p-md-4  px-3 py-4'>
                            <Card.Body>
                                <div className="d-flex align-items-center pb-4">
                                    <h4 className='mb-0'><SingUpIcon currentColor='c00d0d' /> Registre sua conta</h4>
                                    <img className="d-md-none mb-3 ms-auto" src={logo} alt="Logo Baterias Jupiter" width="100px" />
                                </div>
                                <SignUpForm />
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


function SignUpForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [prevFormData, setPrevFormData] = useState({});

    const { errorMessages, setErrorMessages, signUp } = AuthServices();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (JSON.stringify(prevFormData) === JSON.stringify({ email, name, document, password, confirmPassword }) && !errorMessages.serverError) {
            setErrorMessages(prevErrors => ({ ...prevErrors, general: 'Os dados não foram alterados.' }));
            return;
        }

       await signUp(email, name, document, password, confirmPassword);
        setPrevFormData({ email, name, document, password, confirmPassword });
    };


    return (
        <>
            {errorMessages.general || errorMessages.serverError ? (
                <div className='alert alert-danger mb-0'>
                    <AlertIcon size={"16"} currentColor={"#74373e"} />
                    <span className='ms-2'>
                        {errorMessages.general ? errorMessages.general : errorMessages.serverError}
                    </span>
                </div>
            ) : null}

            <Form className="pt-4 " onSubmit={handleSubmit}>

                <FormGroupWithIcon
                    bgBorder={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                    type='email' placeholder='E-mail' mb={'mb-3'}
                    feedback={errorMessages.email}
                />


                <FormGroupWithIcon
                    bgBorder={true}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'20'} />}
                    type='text' placeholder='Nome Completo' mb={'mb-3'}
                    feedback={errorMessages.name}
                />


                <FormGroupWithIcon
                    mask={'999.999.999-99'}
                    bgBorder={true}
                    value={document}
                    onChange={(e) => setDocument(e.target.value)} icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                    type='text' placeholder='CPF' mb={'mb-3'}
                    feedback={errorMessages.document}

                />


                <FormGroupWithIcon
                    bgBorder={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                    type='password' placeholder='Senha' mb={'mb-3'}
                    feedback={errorMessages.password}

                />

                <FormGroupWithIcon
                    bgBorder={true}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<KeyIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                    type='password' placeholder='Confirme sua senha' mb={'mb-3'}
                    feedback={errorMessages.confirmPassword}

                />

                <div className='d-flex justify-content-center mt-4 pt-3'>
                    <Button variant='red' className='flex-grow-1' type='submit'>Cadastrar-se</Button>
                </div>
            </Form>
        </>
    );
}


export default SignUpPage;
