import React, {useState} from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import logoBgWhite from '../../../public/images/logoBgWhite.png';
import logo from '../../../public/images/logo.png';
import ApiAuthentication from '../../services/ApiAuthentication';


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
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [document, setDocument] = useState('');
    const [password, setPassword] = useState('');
    return (
        <Form>
            <FormGroupWithIcon value={email} onChange={(e) => setEmail(e.target.value)} icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='email' placeholder='E-mail' mb={'3'} />
            <FormGroupWithIcon value={name} onChange={(e) => setName(e.target.value)} icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'23'} />} type='text' placeholder='Nome Completo' mb={'3'} />
            <FormGroupWithIcon value={document} onChange={(e) => setDocument(e.target.value)} icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='text' placeholder='CPF' mb={'3'} />
            <FormGroupWithIcon value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />} type='password' placeholder='Senha' mb={'3'} />
            <div className='d-flex justify-content-center'>
                <Button onClick={() => signUp(email, name, document, password)} variant='red' className='flex-grow-1 mt-4'>Cadastrar-se</Button>
            </div>
        </Form>
    );
}


async function signUp(emailSingUp, nameSingUp, documentSingUp, passwordSingUp){
    try {
        const response = await ApiAuthentication.post('/register', {
            email: emailSingUp, 
            password: passwordSingUp,
            name: nameSingUp,
            document: documentSingUp
        });
        console.log('Resposta do cadastro:', response.data.message);
    } catch (error) {
        console.error('Erro ao se cadastrar:', error);
    }
}

export default SignUpPage;
