import React, { useEffect, useState } from 'react';
import { Form, Button, ProgressBar, Popover, OverlayTrigger } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon, KeyIcon, ExclamationCircleIcon, CheckCircleIcon } from '../../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import AuthServices from '../../../services/auth/AuthServices';
import AlertErrorOrSuccess from '../../../components/common/AlertErrorOrSuccess';
import { Link } from 'react-router-dom';

function SignUpForm({ handleToggleForm }) {
    const [singUpFormData, setSingUpFormData] = useState({ name: '', email: '', document: '', password: '', confirmPassword: '', termsAndConditions: false })
    const [prevFormData, setPrevFormData] = useState({});
    const [stepsForm, setStepsForm] = useState('inicial');
    const [animateForm, setAnimateForm] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { signUp, verifyDataRegister, errorMessages, setErrorMessages } = AuthServices();
    const [passwordStrength, setPasswordStrength] = useState({ strength: '', variant: {}, checked: [] });
    const [showPopover, setShowPopover] = useState(false);

    const handleVerifyInicialData = async (e) => {
        e.preventDefault();

        const allKeys = new Set([...Object.keys(prevFormData), ...Object.keys(singUpFormData)]);
        const isEqual = [...allKeys].every(key => prevFormData[key] === singUpFormData[key]);

        const goToConfirmation = () => {
            setAnimateForm(true);
            setStepsForm('confirmation');
        };

        const showError = (message) => {
            setErrorMessages(prevErrors => ({ ...prevErrors, general: message }));
        };

        if (stepsForm === 'inicial') {
            if (formSubmitted && isEqual) {
                goToConfirmation();
            } else if (!isEqual) {
                const response = await verifyDataRegister(singUpFormData);
                setPrevFormData(singUpFormData);
                setFormSubmitted(false);

                if (response) {
                    setErrorMessages({});
                    goToConfirmation();
                }
            } else {
                showError('Os dados não foram alterados');
            }
        } else if (stepsForm === 'confirmation') {
            if (!isEqual) {
                if (!singUpFormData?.termsAndConditions) {
                    showError('Você deve concordar com os Termos e Condições para criar uma conta.');
                    return;
                }
                const response = await signUp(singUpFormData);
                setPrevFormData(singUpFormData);

                if (response) {
                    handleToggleForm({ singUpEmail: singUpFormData.email });
                }
            } else {
                showError('Os dados não foram alterados');
            }
        }
    };

    const handleGoBack = () => {
        setFormSubmitted(true);
        setStepsForm('inicial');
        setErrorMessages({})
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        let checked = [];
        let variant = {};

        if (password.length >= 12) {
            strength += 20;
            checked.push("comprimento");
        }

        if (/\d{4}/.test(password)) {
            strength += 20;
            checked.push("numeros");
        }

        if (/[\W_]/.test(password)) {
            strength += 20;
            checked.push("especiais");
        }

        if (/[A-Z]/.test(password)) {
            strength += 20;
            checked.push("maiusculas");
        }

        if (/[a-z]/.test(password)) {
            strength += 20;
            checked.push("minusculas");
        }

        if (strength < 60) {
            variant = { type: 'danger', text: 'Fraca' }
        } else if (strength < 80) {
            variant = { type: 'warning', text: 'Média' }
        } else if (strength < 100) {
            variant = { type: 'success', text: 'Forte' }
        } else {
            variant = { type: 'success', text: 'Excelente' }
        }

        return { strength, checked: checked, variant };
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        const strength = calculatePasswordStrength(newPassword);
        setPasswordStrength(strength)
        setSingUpFormData({ ...singUpFormData, password: newPassword });
        console.log('teste', passwordStrength)
    };

    const renderIcon = (condition) => {
        return passwordStrength.checked.includes(condition) ? <CheckCircleIcon className={`text-success`} /> : <ExclamationCircleIcon className={`text-danger`} />;
    };
    
    return (
        <section className={`${errorMessages && errorMessages?.general || errorMessages?.serverError ? '' : 'mt-5'}`}>
            <Form onSubmit={(e) => handleVerifyInicialData(e)}>
                <AlertErrorOrSuccess errorMessages={errorMessages} />
                {stepsForm === 'inicial' && (
                    <div className={animateForm ? "fadeInLeft" : ""}>
                        <Form.Label className='w-100' htmlFor='emailLogin'>Endereço de E-mail
                            <FormGroupWithIcon
                                bgBorder={true}
                                value={singUpFormData.email}
                                onChange={(e) => setSingUpFormData({ ...singUpFormData, email: e.target.value })}
                                icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='email' placeholder='E-mail'
                                feedback={errorMessages.email}
                            />
                        </Form.Label>
                        <Form.Label className='mt-2 w-100' htmlFor='emailLogin'>Nome Completo
                            <FormGroupWithIcon
                                bgBorder={true}
                                value={singUpFormData.name}
                                onChange={(e) => setSingUpFormData({ ...singUpFormData, name: e.target.value })}
                                icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'20'} />}
                                type='text' placeholder='Nome Completo'
                                feedback={errorMessages.name}
                            />
                        </Form.Label>
                        <Form.Label className='mt-2 w-100' htmlFor='emailLogin'>CPF
                            <FormGroupWithIcon
                                bgBorder={true}
                                value={singUpFormData.document}
                                onChange={(e) => setSingUpFormData({ ...singUpFormData, document: e.target.value })} icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='text' placeholder='CPF'
                                feedback={errorMessages.document}
                            />
                        </Form.Label>
                    </div>
                )}

                {stepsForm === 'confirmation' && (
                    <>
                        <div className={animateForm ? "fadeInRight" : ""}>
                            <Form.Group className="input-create-password">
                                <Form.Label className='w-100' htmlFor='emailLogin'>Crie sua Senha
                                    <FormGroupWithIcon
                                        bgBorder={true}
                                        value={singUpFormData.password}
                                        onChange={handlePasswordChange}
                                        icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                        type='password' placeholder='Senha'
                                        feedback={errorMessages.password}
                                    />
                                </Form.Label>
                                {
                                    singUpFormData?.password !== '' && !errorMessages?.passWord && (

                                        <section className="w-100 d-none input-progress-container align-items-center justify-content-end position-relative">
                                            <div className="w-50">
                                                <ProgressBar variant={passwordStrength?.variant?.type} now={passwordStrength?.strength} label={`${passwordStrength?.variant?.text}`} />
                                            </div>

                                            <div className="input-progress-container position-absolute z-1 mt-2" id="meuPopover" style={{position: 'absolute', top: '100%', right: -20, visibility: showPopover ? 'visible' : 'hidden'  }}
                                           
                                            >
                                                <div className="popover" >
                                                    <div className='popover-header '>
                                                        <span className='small'>Dicas de senha segura</span>
                                                    </div>
                                                    <div className="popover-content p-2">
                                                        <div>
                                                            <p className='mb-1'>{renderIcon("comprimento")} 12 caracteres ou mais.</p>
                                                            <p className='mb-1'>{renderIcon("numeros")} Incluir 4 números ou mais.</p>
                                                            <p className='mb-1'>{renderIcon("especiais")} Adicione Caracteres especiais.</p>
                                                            <p className='mb-1'>{renderIcon("maiusculas")} Use letras maiúsculas.</p>
                                                            <p className='mb-1'>{renderIcon("minusculas")} Use letras minúsculas.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <a
                                                className='float-end ms-2 text-muted z-3'
                                                type="button"
                                                onMouseOver={() => setShowPopover(true)}
                                                onMouseOut={() => setShowPopover(false)}
                                            >
                                                <ExclamationCircleIcon />
                                            </a>
                                        </section>
                                    )}
                            </Form.Group>

                            <Form.Label className='mt-2 w-100' htmlFor='emailLogin'>Confirme sua Senha
                                <FormGroupWithIcon
                                    bgBorder={true}
                                    value={singUpFormData.confirmPassword}
                                    onChange={(e) => setSingUpFormData({ ...singUpFormData, confirmPassword: e.target.value })}
                                    icon={<KeyIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                    type='password' placeholder='Confirme sua senha'
                                    feedback={errorMessages.confirmPassword}

                                />
                            </Form.Label>

                            <Form.Check className="mt-2"
                                label={
                                    <span className=' text-muted small'>
                                        Ao se cadastrar concordo com os
                                        <Link className="ms-1 text-muted" to="/termos">Termos e Condições</Link>
                                    </span>
                                }
                                value={singUpFormData.termsAndConditions}
                                onChange={(e) => setSingUpFormData({ ...singUpFormData, termsAndConditions: e.target.value })}
                            >
                            </Form.Check>
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
        </section>
    );
}


export default SignUpForm;