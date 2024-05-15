import FormGroupWithIcon from "../../../components/common/FormGroupWithIcon";
import { Form, Button, Col, Row, Modal, InputGroup } from "react-bootstrap";
import { DolarIcon, AlertIcon, LockIcon } from "../../../assets/icons/IconsSet";
import { useState, useEffect, useContext } from "react";
import UserService from "../../../services/users/UsersServices";
import AlertErrorOrSuccess from "../../../components/common/AlertErrorOrSuccess";
import { AuthContext } from "../../../context/AuthProvider";

const ConfirmDesactiveAccontModal = ({ showModal, setShowModal, userData, handleConfirm, errorMessages, setErrorMessages }) => {
    const [verifyPassword, setVerifyPassword] = useState('')
    const [verifyConfirmPassword, setVerifyConfirmPassword] = useState('')
    const [successMessages, setSuccessMessages] = useState(null)

    return (
        <Modal centered show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Desativar Conta</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModal(false)} />
            </Modal.Header>
            <Modal.Body className="mt-2">
                <AlertErrorOrSuccess errorMessages={errorMessages} successMessage={successMessages} />
                <InputGroup hasValidation>
                    <Form.Label>Digite sua senha para desativar a conta {userData ? userData.name : 'carregando...'} </Form.Label>
                    <FormGroupWithIcon
                        icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='text'
                        placeholder='Senha'
                        mb={'mb-3'}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                    <FormGroupWithIcon
                        icon={<LockIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                        type='text'
                        placeholder='Confirme sua senha'
                        mb={'mb-3'}
                        value={verifyConfirmPassword}
                        onChange={(e) => setVerifyConfirmPassword(e.target.value)}
                    />
                </InputGroup>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
                <Button variant="red" onClick={(e) => {
                    if (verifyPassword !== verifyConfirmPassword) {
                        setErrorMessages({ general: "Senhas incompatíveis" })
                    }
                    handleConfirm(e, 'desactive')
                }
                }>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    )

}


function AccontContent({ userData }) {
    const [email, setEmail] = useState(userData ? userData.email : '')
    const [name, setName] = useState(userData ? userData.name : '')
    const [disableFormControl, setDisableFormControl] = useState(true);
    const [request, setRequest] = useState('view')
    const [successMessage, setSuccessMessage] = useState(null)
    const [showConfirmDesactiveAccontModal, setShowConfirmDesactiveAccontModal] = useState(false);
    const [showMainContent, setShowMainContent] = useState(false)
    const { desactiveAccont, errorMessages, setErrorMessages, updateUser } = UserService();



    const handleConfirm = async (e, action) => {
        e.preventDefault();

        if (action === 'desactive') {
            setShowMainContent(false)
            desactiveAccont(userData.userId);
        }

    }

    const handleClick = (e) => {
        e.preventDefault();
        setRequest(request === 'view' ? 'update' : 'view');
        setSuccessMessage(null)
    };

    const handleUpdate = async (userId, name, email) => {
        
            const response = await updateUser(userId, name, email)
            response ? (setRequest('view'), setSuccessMessage("Cadastro atualizado com sucesso!")) : setRequest('update')
            setShowMainContent(true)

            if (response) {
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
            <header className="mb-2">
                <h4>Dados da Conta</h4>
                <span className="text-muted">Atualize suas informações pessoais aqui para garantir uma experiência personalizada.
                    Mantenha seus detalhes precisos e atualizados.</span>
            </header>

            {showMainContent === true ? <AlertErrorOrSuccess successMessage={successMessage} errorMessages={errorMessages} /> : null}

            <Form className="mt-3">
                <Row>
                    <Col md={12}>
                        <Form.Label>Nome completo</Form.Label>
                        <FormGroupWithIcon
                            icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
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
                        icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
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
                            icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                            type='text'
                            placeholder=''
                            value={userData ? userData.document : ''}
                            disable={true}
                            mb={'mb-3'}
                        />
                    </Col>

                </Row>
            </Form>

            <div className=" d-flex justify-content-end flex-column flex-md-row mt-5">
                {request == 'view' ? <Button variant="yellow ms-md-3" onClick={(e) => handleClick(e)}>Editar Dados</Button>
                    : <Button variant="yellow ms-md-3" onClick={(e) => handleUpdate(userData.userId, name, email)}>Atualizar Dados</Button>
                }

                {request == 'view' ? <Button variant="red-outline order-md-first mt-md-0 mt-3" onClick={() => setShowConfirmDesactiveAccontModal(true)}>Desativar Conta</Button>
                    : <Button variant="red-outline order-md-first mt-md-0 mt-3" onClick={() => setRequest('view')}>Cancelar</Button>
                }

            </div>


            <ConfirmDesactiveAccontModal showModal={showConfirmDesactiveAccontModal} setShowModal={setShowConfirmDesactiveAccontModal}
                userData={userData} handleConfirm={handleConfirm}
                errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
        </>
    );
}

export default AccontContent;