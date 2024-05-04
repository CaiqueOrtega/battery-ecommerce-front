import FormGroupWithIcon from "../../../components/common/FormGroupWithIcon";
import { Form, Button, Col, Row, Container, Modal, InputGroup } from "react-bootstrap";
import { DolarIcon, AlertIcon } from "../../../assets/icons/IconsSet";
import { useState } from "react";
import UserService from "../../../services/users/UsersServices";

const ConfirmDesactiveAccontModal = ({ showModal, setShowModal, userData, handleConfirm, errorMessages, setErrorMessages }) => {
    const [verifyCPFValue, setVerifyCPFValue] = useState('')


    return (
        <Modal centered show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Desativar Conta</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModal(false)} />
            </Modal.Header>
            <Modal.Body className="mt-2">
                <InputGroup hasValidation>
                    <Form.Label>Digite seu CPF para desativar a conta {userData.name ? userData.name : 'carregando...'} </Form.Label>
                    <FormGroupWithIcon
                        icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                        type='text'
                        placeholder='CPF'
                        mb={'mb-3'}
                        value={verifyCPFValue}
                        onChange={(e) => setVerifyCPFValue(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid" className="ms-1">
                        {errorMessages && errorMessages.documentVerify && <AlertIcon size="14" currentColor={"currentcolor"} />}
                        {errorMessages ? errorMessages.documentVerify : null}
                    </Form.Control.Feedback>
                </InputGroup>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
                <Button variant="red" onClick={(e) => {
                    console.log('userData', userData.document)
                    console.log('CPF', verifyCPFValue)
                    if (userData.document !== verifyCPFValue) {
                        console.log('teste')
                        setErrorMessages({ documentVerify: 'CPF inválido' })
                        return;
                    }

                    handleConfirm(e, 'desactive' )
                }
                }>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    )

}



function AccontContent({ userData }) {
    const [disableFormControl, setDisableFormControl] = useState(true);
    const [showConfirmDesactiveAccontModal, setShowConfirmDesactiveAccontModal] = useState(false);
    const { desactiveAccont, errorMessages, setErrorMessages } = UserService();

    const handleConfirm = async (e, action) => {
        e.preventDefault();
        let response;
        if (action === 'desactive') {
            response = await desactiveAccont(userData.userId);
        }

    }


    return (
        <>
            <div className="px-md-5 py-3 h-100">
                <div>
                    <h4>Dados da Conta</h4>
                    <span className="text-muted">Atualize suas informações pessoais aqui para garantir uma experiência personalizada.
                        Mantenha seus detalhes precisos e atualizados. Se precisar de ajuda,
                        estamos à disposição.</span>
                </div>

                <Form className="mt-4">
                    <Row>
                        <Col md={12}>
                            <Form.Label>Nome completo</Form.Label>
                            <FormGroupWithIcon
                                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type='text'
                                placeholder=''
                                value={userData.name}
                                mb={'mb-3'}
                                disable={disableFormControl}
                            />

                        </Col>

                        <Form.Label>Email</Form.Label>
                        <FormGroupWithIcon
                            icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                            type='text'
                            placeholder=''
                            value={userData.email}
                            mb={'mb-3'}
                            disable={disableFormControl}
                        />

                        <Col md={7}>
                            <Form.Label>CPF</Form.Label>
                            <FormGroupWithIcon
                                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type='text'
                                placeholder=''
                                value={userData.document}
                                disable={disableFormControl}
                                mb={'mb-3'}
                            />
                        </Col>

                        <Col md={5}>
                            <Form.Label>Telefone</Form.Label>
                            <FormGroupWithIcon
                                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type='text'
                                placeholder=''
                            />
                        </Col>

                    </Row>
                </Form>


                <div className="d-flex justify-content-end mt-4 pt-2">
                    <Button variant="yellow ms-md-3" >Atualizar Dados</Button>
                    <Button variant="red-outline order-md-first mt-md-0 mt-3" onClick={() => setShowConfirmDesactiveAccontModal(true)}>Desativar Conta</Button>

                </div>

            </div>

            <ConfirmDesactiveAccontModal showModal={showConfirmDesactiveAccontModal} setShowModal={setShowConfirmDesactiveAccontModal}
                userData={userData} handleConfirm={handleConfirm}
                errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
        </>
    );
}

export default AccontContent;