import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon } from '../../../assets/icons/IconsSet.jsx';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon.jsx';
import AuthServices from '../../../services/auth/AuthServices.jsx';
import AlertErrorOrSuccess from '../../../components/common/AlertErrorOrSuccess.jsx';

function LoginForm({ emailSingUp }) {
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
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
    if (emailSingUp) {
      setEmailLogin(emailSingUp);
    }
  }, [emailSingUp]);

  return (
    <section className={`${errorMessages && errorMessages?.general || errorMessages?.serverError ? '' : 'mt-5'}`}>
      <Form onSubmit={handleSubmit}>
        <AlertErrorOrSuccess errorMessages={errorMessages} />
        <Form.Label className='w-100' htmlFor='emailLogin'>Endereço de E-mail
          <FormGroupWithIcon
            bgBorder={true}
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
            type='email' placeholder='exemplo@gmail.com'
            feedback={errorMessages.email}
          />
        </Form.Label>

        <Form.Label htmlFor='passwordLogin' className=' mt-2 w-100'>Senha
          <FormGroupWithIcon
            bgBorder={true}
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
            type='password' placeholder='•••••••••'
            feedback={errorMessages.password}
          />
        </Form.Label>

        <a type='button' className='text-muted small'>Esqueceu sua Senha?</a>
        <div className='d-flex justify-content-center mt-5'>
          <Button variant='red' className='flex-grow-1' type='submit'>Entrar</Button>
        </div>
      </Form>
    </section>
  );
}

export default LoginForm;
