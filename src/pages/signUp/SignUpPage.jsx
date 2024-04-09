import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../assets/images/logoBgWhite.png';
import logo from '../../assets/images/logo.png';
import ConnectionAPI from '../../services/ConnectionAPI';


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
    const [errorMessages, setErrorMessages] = useState({});
    const [prevFormData, setPrevFormData] = useState({})
    
 
    async function signUp(emailSignUp, nameSignUp, documentSignUp, passwordSignUp) {
        if (JSON.stringify(prevFormData) === JSON.stringify({ email: emailSignUp, name: nameSignUp, document: documentSignUp, password: passwordSignUp })) {
            setErrorMessages(prevErrors => ({ ...prevErrors, general: 'Os dados não foram alterados.' }));
            return;
        }

        setPrevFormData({ email: emailSignUp, name: nameSignUp, document: documentSignUp, password: passwordSignUp });

        try {
            const response = await ConnectionAPI.post('auth/register', {
                email: emailSignUp,
                password: passwordSignUp,
                name: nameSignUp,
                document: documentSignUp
            });


        } catch (error) {
            
            if (error.response) {
                const { field, message } = error.response.data;
                setErrorMessages({ [field]: message });
               
            } else if (error.request) {
                setErrorMessages({ general: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
            } else {
                setErrorMessages( { general: 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.' });
            }
        }
        
    }

    return (
        <>
            {errorMessages.general && (
                <div className='alert alert-danger mb-0'>

                    <AlertIcon size={"16"} currentColor={"#74373e"} />
                    <span className='ms-2'>
                        {errorMessages.general}
                    </span>
                </div>
            )}

            <Form className="pt-4 " onSubmit={(e) => {
                e.preventDefault();
                signUp(email, name, document, password);
            }}>
                <InputGroup hasValidation>
                    <FormGroupWithIcon value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='email' placeholder='E-mail' mb={'mb-3'}
                        feedback={errorMessages.email}
                    />
                </InputGroup>

                <InputGroup hasValidation>
                    <FormGroupWithIcon value={name}
                        onChange={(e) => setName(e.target.value)}
                        icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'20'} />}
                        type='text' placeholder='Nome Completo' mb={'mb-3'}
                        feedback={errorMessages.name}
                    />
                </InputGroup>

                <InputGroup hasValidation>
                    <FormGroupWithIcon value={document}
                        onChange={(e) => setDocument(e.target.value)} icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='text' placeholder='CPF' mb={'mb-3'}
                        feedback={errorMessages.document}
                        
                    />
                </InputGroup>

                <InputGroup hasValidation>
                    <FormGroupWithIcon value={password} onChange={(e) => setPassword(e.target.value)} icon={
                        <LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='password' placeholder='Senha' mb={'mb-3'}
                        feedback={errorMessages.password}
                        
                    />
                </InputGroup>
                <div className='d-flex justify-content-center mt-4 pt-3'>
                    <Button variant='red' className='flex-grow-1' type='submit'>Cadastrar-se</Button>
                </div>
            </Form>
        </>
    );
}


export default SignUpPage;
