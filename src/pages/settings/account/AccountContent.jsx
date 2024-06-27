import FormGroupWithIcon from "../../../components/common/FormGroupWithIcon";
import { Form, Button, Col, Row, Modal, InputGroup } from "react-bootstrap";
import { DollarIcon, AlertIcon, LockIcon, UserIcon, EnvelopeIcon, DocumentIcon } from "../../../assets/icons/IconsSet";
import { useState, useEffect, useContext } from "react";
import UserService from "../../../services/users/UsersServices";
import AlertErrorOrSuccess from "../../../components/common/AlertErrorOrSuccess";

const ConfirmDisableAccountModal = ({ showModal, setShowModal, userData, handleConfirm, errorMessages, setErrorMessages }) => {
    const [verifyPassword, setVerifyPassword] = useState('')
    const [verifyConfirmPassword, setVerifyConfirmPassword] = useState('')
    const [prevValues, setPrevValues] = useState({ password: null, confirmPassword: null })
    const [successMessages, setSuccessMessages] = useState(null)

    return (
        <Modal centered show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Desativar Conta</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModal(false)} />
            </Modal.Header>
            <Modal.Body className="mt-2">
                <AlertErrorOrSuccess errorMessages={errorMessages} successMessage={successMessages} />
                <Form.Label className="px-4">Digite sua senha para desativar a conta {userData ? userData.name : 'carregando...'} </Form.Label>
                <div className="px-4">
                    <FormGroupWithIcon
                        icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='text'
                        placeholder='Senha'
                        mb={'mb-3'}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                </div>
                <div className="mt-2 px-4">
                    <FormGroupWithIcon
                        icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='text'
                        placeholder='Confirme sua senha'
                        mb={'mb-3'}
                        value={verifyConfirmPassword}
                        onChange={(e) => setVerifyConfirmPassword(e.target.value)}
                    />
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
                <Button variant="red" onClick={async (e) => {
                    if (prevValues.password == verifyPassword && prevValues.confirmPassword == verifyConfirmPassword) {
                        setErrorMessages({ general: "Os dados não foram alterados" })
                        return
                    }
                    if (verifyPassword !== verifyConfirmPassword) {
                        setErrorMessages({ general: "Senhas incompatíveis" })
                        return
                    }

                    const response = await handleConfirm(e, 'disable', verifyPassword)
                    if (!response) {
                        setPrevValues({ password: verifyPassword, confirmPassword: verifyConfirmPassword })
                    }

                }
                }>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    )

}


function AccountContent({ userData }) {
    const [email, setEmail] = useState(userData ? userData.email : '')
    const [name, setName] = useState(userData ? userData.name : '')
    const [prevValues, setPrevValues] = useState(userData ? { name: userData.name, email: userData.email } : {})
    const [disableFormControl, setDisableFormControl] = useState(true);
    const [request, setRequest] = useState('view')
    const [successMessage, setSuccessMessage] = useState(null)
    const [showConfirmDisableAccountModal, setShowConfirmDisableAccountModal] = useState(false);
    const [showMainContent, setShowMainContent] = useState(false)
    const { disableAccount, errorMessages, setErrorMessages, updateUser } = UserService();



    const handleConfirm = async (e, action, password) => {
        e.preventDefault();

        if (action === 'disable') {
            setShowMainContent(false);
            const response = await disableAccount(userData.userId, password);
            if (response) {
                return true;
            } else {
                return false;
            }
        }
    };


    const handleClick = (e) => {
        e.preventDefault();
        setRequest(request === 'view' ? 'update' : 'view');
        setSuccessMessage(null)
    };

    const handleUpdate = async (userId, name, email) => {
        if (prevValues.name == name && prevValues.email == email) {
            setShowMainContent(true)
            setErrorMessages({ general: "Dados não foram alterados" })
            return
        }

        const response = await updateUser(userId, name, email)
        response ? (setRequest('view'), setSuccessMessage("Cadastro atualizado com sucesso!")) : setRequest('update')
        setShowMainContent(true)

        if (response) {
            setPrevValues({ name: name, email: email })
            setShowMainContent(true)
            setErrorMessages({})
        }
    }

    useEffect(() => {
        if (request === 'update') {
            setDisableFormControl(false);
        } else {
            setDisableFormControl(true)
        }
    }, [request]);


    return (
        <>
            <div className="d-flex justify-content-between align-items-center px-5 py-3 bg-yellow text-white fw-bold" style={{ maxHeight: 60 }}>
                <h4 className="mb-0">Dados de Cadastro</h4>
            </div>
            <section className="px-5 py-4 d-flex h-100 justify-content-center flex-column ">
                <header className="mb-4 pb-2">
                    <span className="text-muted">Atualize suas informações pessoais aqui para garantir uma experiência personalizada.
                        Mantenha seus detalhes precisos e atualizados.</span>
                </header>

                {showMainContent === true ? <AlertErrorOrSuccess successMessage={successMessage} errorMessages={errorMessages} /> : null}

                <Form>
                    <Row>
                        <Col md={12}>
                            <Form.Label>Nome completo</Form.Label>
                            <FormGroupWithIcon
                                icon={<UserIcon className='position-absolute ms-3' currentColor='a3a29f' size={'20'} />}
                                type='text'
                                placeholder=''
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                mb={'mb-3'}
                                disable={disableFormControl}
                                feedback={errorMessages.name}
                            />

                        </Col>

                        <Form.Label>Email</Form.Label>
                        <FormGroupWithIcon
                            icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                            type='email'
                            placeholder=''
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            mb={'mb-3'}
                            disable={disableFormControl}
                            feedback={errorMessages.email}
                        />

                        <Col md={12}>
                            <Form.Label>CPF</Form.Label>
                            <FormGroupWithIcon
                                icon={<DocumentIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='text'
                                placeholder=''
                                value={userData ? userData.document : ''}
                                disable={true}
                            />
                        </Col>

                    </Row>
                </Form>

                <div className=" d-flex justify-content-end flex-column flex-md-row mt-5">
                    {request == 'view' ? <Button variant="yellow ms-md-3" onClick={(e) => handleClick(e)}>Editar Dados</Button>
                        : <Button variant="yellow ms-md-3" onClick={(e) => handleUpdate(userData.userId, name, email)}>Atualizar Dados</Button>
                    }

                    {request == 'view' ? <Button variant="red-outline order-md-first mt-md-0 mt-3" onClick={() => setShowConfirmDisableAccountModal(true)}>Desativar Conta</Button>
                        : <Button variant="red-outline order-md-first mt-md-0 mt-3" onClick={() => setRequest('view')}>Cancelar</Button>
                    }

                </div>


                <ConfirmDisableAccountModal showModal={showConfirmDisableAccountModal} setShowModal={setShowConfirmDisableAccountModal}
                    userData={userData} handleConfirm={handleConfirm}
                    errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
            </section>
        </>
    );
}

export default AccountContent;