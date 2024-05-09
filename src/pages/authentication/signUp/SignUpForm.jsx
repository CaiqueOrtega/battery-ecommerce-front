import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { LockIcon, EnvelopeIcon, UserIcon, DocumentIcon, SingUpIcon, AlertIcon, KeyIcon } from '../../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import AuthServices from '../../../services/auth/AuthServices';
import AlertErrorOrSuccess from '../../../components/common/AlertErrorOrSuccess';

function SignUpForm() {
    const [singUpFormData, setSingUpFormData] = useState({ name: '', email: '', document: '', password: '', confirmPassword: '' })
    const [prevFormData, setPrevFormData] = useState({});
    const [stepsForm, setStepsForm] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showInitialForm, setShowInitialForm] = useState(true);



    const { signUp, verifyDataRegister, errorMessages, setErrorMessages } = AuthServices();

    const isEqualsData = () => {
        if (prevFormData) {
            const keys = new Set([...Object.keys(prevFormData), ...Object.keys(singUpFormData)]);
            const isEqual = Array.from(keys).every(key => prevFormData[key] === singUpFormData[key]);

            if (isEqual) {
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados.'
                }));
            }

            setPrevFormData(singUpFormData);

            return isEqual;
        }
    }

    const handleVerifyInicialData = async (e) => {
        e.preventDefault();

        if (!isEqualsData()) {
            const response = await verifyDataRegister(singUpFormData);

            if (response) setStepsForm(false);
        }
    };

    return (
        <div>
            <AlertErrorOrSuccess errorMessages={errorMessages} />

            <Form className="pt-4 " onSubmit={(e) => handleVerifyInicialData(e)}>

                {showConfirmation && (
                    <div className={stepsForm ? "fadeOutRight" : "fadeInLeft"}>
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

                {showInitialForm && (
                    <div className={!stepsForm ? "fadeOutRight" : "fadeInLeft"}>
                        <FormGroupWithIcon
                            bgBorder={true}
                            value={singUpFormData.password}
                            onChange={(e) => setSingUpFormData({ ...singUpFormData, password: e.target.value })}
                            icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                            type='password' placeholder='Senha' mb={'mb-3'}
                            feedback={errorMessages.password}

                        />

                        <FormGroupWithIcon
                            bgBorder={true}
                            value={singUpFormData.confirmPassword}
                            onChange={(e) => setSingUpFormData({ ...singUpFormData, confirmPassword: e.target.value })}
                            icon={<KeyIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                            type='password' placeholder='Confirme sua senha' mb={'mb-3'}
                            feedback={errorMessages.confirmPassword}

                        />
                    </div>

                )}



                <div className='d-flex justify-content-center mt-4 pt-3'>
                    <Button variant='red' className='flex-grow-1' type='submit'>Avançar</Button>
                </div>
            </Form>
        </div>
    );
}


export default SignUpForm;