import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon, KeyIcon } from '../../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import AuthServices from '../../../services/auth/AuthServices';


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


    const InicialForm = () => (
        <>
            <Form.Label className='mt-3 w-100' htmlFor='emailLogin'>Endereço de E-mail</Form.Label>
            <FormGroupWithIcon
                bgBorder={true}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                type='email' placeholder='E-mail' mb={'mb-3'}
                feedback={errorMessages.email}
            />

            <Form.Label className=' w-100' htmlFor='emailLogin'>Nome Completo</Form.Label>
            <FormGroupWithIcon
                bgBorder={true}
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'20'} />}
                type='text' placeholder='Nome Completo' mb={'mb-3'}
                feedback={errorMessages.name}
            />

            <Form.Label className=' w-100' htmlFor='emailLogin'>CPF</Form.Label>

            <FormGroupWithIcon
                bgBorder={true}
                value={document}
                onChange={(e) => setDocument(e.target.value)} icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                type='text' placeholder='CPF' mb={'mb-4'}
                feedback={errorMessages.document}

            />
        </>
    )

    const ConfirmPasswordForm = () => (
        <>
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

        </>
    )

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

                <InicialForm />


                <div className='d-flex justify-content-center mt-4 pt-3'>
                    <Button variant='red' className='flex-grow-1' type='submit'>Avançar</Button>
                </div>
            </Form>
        </>
    );
}


export default SignUpForm;