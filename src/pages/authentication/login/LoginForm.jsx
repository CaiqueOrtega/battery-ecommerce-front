import React, { useState, useEffect } from 'react';
import {Form, Button} from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, AlertIcon } from '../../../assets/icons/IconsSet.jsx';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon.jsx';
import { useLocation } from "react-router-dom";
import AuthServices from '../../../services/auth/AuthServices.jsx';



function LoginForm({ navigate }) {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const location = useLocation();
  const { errorMessages, setErrorMessages, login } = AuthServices();
  const [prevFormDataLogin, setPrevFormDataLogin] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (JSON.stringify(prevFormDataLogin) === JSON.stringify({ email: emailLogin, password: passwordLogin }) && !errorMessages.serverError) {
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
      {errorMessages.general || errorMessages.serverError ? (
        <div className='msg alert alert-danger mb-0'>
          <AlertIcon size={"16"} currentColor={"#74373e"} />
          <span className='ms-2'>
            {errorMessages.general ? errorMessages.general : errorMessages.serverError}
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

export default LoginForm;
