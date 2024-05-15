import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon, KeyIcon } from '../../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import AuthServices from '../../../services/auth/AuthServices';
import AlertErrorOrSuccess from '../../../components/common/AlertErrorOrSuccess';

function SignUpForm({ handleToggleForm }) {
    const [singUpFormData, setSingUpFormData] = useState({ name: '', email: '', document: '', password: '', confirmPassword: '' })
    const [prevFormData, setPrevFormData] = useState({});
    const [stepsForm, setStepsForm] = useState('inicial');
    const [animateForm, setAnimateForm] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);



    const { signUp, verifyDataRegister, errorMessages, setErrorMessages } = AuthServices();


    const handleVerifyInicialData = async (e) => {
        e.preventDefault();

        const keys = new Set([...Object.keys(prevFormData), ...Object.keys(singUpFormData)]);
        const isEqual = Array.from(keys).every(key => prevFormData[key] === singUpFormData[key]);

        if (stepsForm === 'inicial') {
            if (formSubmitted && isEqual) {
                // Se formSubmitted for true e os dados foram iguais, avançamos para a próxima etapa
                setAnimateForm(true);
                setStepsForm('confirmation');
                return;
            }

            if (!isEqual) {
                // Se os dados foram alterados
                const response = await verifyDataRegister(singUpFormData);
                setPrevFormData(singUpFormData);
                setFormSubmitted(false);

                if (response) {
                    // Se a requisição for bem-sucedida, avançamos para a próxima etapa
                    setErrorMessages({});
                    setAnimateForm(true);
                    setStepsForm('confirmation');
                }
            } else {
                // Se os dados não foram alterados
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados'
                }));
            }
        } if (stepsForm === 'confirmation') {
            if (!isEqual) {
                const response = await signUp(singUpFormData);
                setPrevFormData(singUpFormData);
            
                if (response) {
                    const singUpEmail = singUpFormData.email;
                    handleToggleForm({singUpEmail});
                }

            }else {
                // Se os dados não foram alterados
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados'
                }));
            }
        }


    };




    const handleGoBack = () => {
        setFormSubmitted(true);
        setStepsForm('inicial');
        setErrorMessages({})
    };


    return (
        <div>
            <AlertErrorOrSuccess errorMessages={errorMessages} />

            <Form className="pt-4 " onSubmit={(e) => handleVerifyInicialData(e)}>

                {stepsForm === 'inicial' && (
                    <div className={animateForm ? "fadeInLeft" : ""}>
                        <Form.Label className='mt-md-3 w-100' htmlFor='emailLogin'>Endereço de E-mail</Form.Label>
                        <FormGroupWithIcon
                            bgBorder={true}
                            value={singUpFormData.email}
                            onChange={(e) => setSingUpFormData({ ...singUpFormData, email: e.target.value })}
                            icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                            type='email' placeholder='E-mail' mb={'mb-3'}
                            feedback={errorMessages.email}
                        />

                        <Form.Label className=' w-100' htmlFor='emailLogin'>Nome Completo</Form.Label>
                        <FormGroupWithIcon
                            bgBorder={true}
                            value={singUpFormData.name}
                            onChange={(e) => setSingUpFormData({ ...singUpFormData, name: e.target.value })}
                            icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'20'} />}
                            type='text' placeholder='Nome Completo' mb={'mb-3'}
                            feedback={errorMessages.name}
                        />

                        <Form.Label className=' w-100' htmlFor='emailLogin'>CPF</Form.Label>

                        <FormGroupWithIcon
                            bgBorder={true}
                            value={singUpFormData.document}
                            onChange={(e) => setSingUpFormData({ ...singUpFormData, document: e.target.value })} icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                            type='text' placeholder='CPF' mb={'mb-4'}
                            feedback={errorMessages.document}

                        />
                    </div>
                )}

                {stepsForm === 'confirmation' && (
                    <>
                        <div className={animateForm ? "fadeInRight" : ""}>

                            <Form.Label className=' w-100' htmlFor='emailLogin'>Senha</Form.Label>
                            <FormGroupWithIcon
                                bgBorder={true}
                                bgBosetprevValuesrder={true}
                                value={singUpFormData.password}
                                onChange={(e) => setSingUpFormData({ ...singUpFormData, password: e.target.value })}
                                icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='password' placeholder='Senha' mb={'mb-3'}
                                feedback={errorMessages.password}

                            />

                            <Form.Label className=' w-100' htmlFor='emailLogin'>Confirme sua Senha</Form.Label>
                            <FormGroupWithIcon
                                bgBorder={true}
                                value={singUpFormData.confirmPassword}
                                onChange={(e) => setSingUpFormData({ ...singUpFormData, confirmPassword: e.target.value })}
                                icon={<KeyIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='password' placeholder='Confirme sua senha' mb={'mb-3'}
                                feedback={errorMessages.confirmPassword}

                            />
                            <p className='fs-6 sw-light color-red text-justify text-start'>* Senha segura: Pelo menos 12 caracteres, incluindo 4 números e 1 caractere especial.</p>
                        </div>

                    </>
                )}



                <div className='d-flex justify-content-center mt-4 pt-3'>
                    {stepsForm === 'confirmation' && (
                        <Button variant='secondary me-5' className='flex-grow-1' onClick={handleGoBack}>
                            Voltar
                        </Button>
                    )}

                    <Button variant='red' className='flex-grow-1' type='submit'>Avançar</Button>
                </div>
            </Form>
        </div>
    );
}


export default SignUpForm;