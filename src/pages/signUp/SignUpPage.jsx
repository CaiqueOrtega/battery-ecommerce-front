import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon, KeyIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import ConnectionAPI from '../../services/ConnectionAPI';
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
    const [errorMessages, setErrorMessages] = useState({});
    const [prevFormData, setPrevFormData] = useState({})
    const navigate = useNavigate();

    async function signUp(emailSignUp, nameSignUp, documentSignUp, passwordSignUp, confirmPassword) {


        if (JSON.stringify(prevFormData) === JSON.stringify({ email: emailSignUp, name: nameSignUp, document: documentSignUp, password: passwordSignUp, confirmPassword: confirmPassword }) && !errorMessages.severError) {
            setErrorMessages(prevErrors => ({ ...prevErrors, general: 'Os dados não foram alterados.' }));
            return;
        }

        setPrevFormData({ email: emailSignUp, name: nameSignUp, document: documentSignUp, password: passwordSignUp, confirmPassword: confirmPassword });

        console.log(confirmPassword);

        try {
            const response = await ConnectionAPI.post('auth/register', {
                email: emailSignUp,
                password: passwordSignUp,
                name: nameSignUp,
                document: documentSignUp,
                confirmPassword: confirmPassword
            });

            navigate("/entrar", { state: { email: emailSignUp } });

        } catch (error) {

            if (error.response) {
                const { field, message } = error.response.data;
                setErrorMessages({ [field]: message });

            } else if (error.request) {
                setErrorMessages({ severError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
            }
        }
    }

    return (
        <>
            {errorMessages.general || errorMessages.severError ? (
                <div className='alert alert-danger mb-0'>
                    <AlertIcon size={"16"} currentColor={"#74373e"} />
                    <span className='ms-2'>
                        {errorMessages.general ? errorMessages.general : errorMessages.severError}
                    </span>
                </div>
            ) : null}

            <Form className="pt-4 " onSubmit={(e) => {
                e.preventDefault();
                signUp(email, name, document, password, confirmPassword);
            }}>

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
