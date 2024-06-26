import React, { useContext, useState } from "react";
import { Card, Table, Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { AlertIcon, PdfIcon } from "../../../assets/icons/IconsSet";
import UserService from "../../../services/users/UsersServices";
import ConfirmChangesModal from "../../../components/common/ConfirmChangesModal";
import { AuthContext } from '../../../context/AuthProvider';
import Pagination from "../../../components/common/Pagination";
import ModalPdf from '../../../services/pdf/Report'
import SortButton from "../../../components/common/SortButton";

function UserIndex({ users, setUsers, usersIsLoaded }) {
    const { userData } = useContext(AuthContext);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedRole, setSelectedRole] = useState({});
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});
    const [showsModalPDF, setShowModalPDF] = useState(false);
    const [activeField, setActiveField] = useState(null);

    const { changeRole, errorMessages, setErrorMessages } = UserService()

    const handleConfirmChangesModal = async () => {
        const response = await changeRole(selectedUser.userId, selectedRole, userData.userId);

        if (response.success) {
            const updatedUsers = users.map(users => {
                if (users.userId === selectedUser.userId) {
                    return { ...users, role: selectedRole };
                }
                return users;
            })

            setUsers(updatedUsers);

            setShowConfirmChangesModal(false);
            setShowUserModal(false);
        }
    }

    const renderUserModal = () => {

        if (!selectedUser) return null;

        const fetchInitials = (userDataName) => {
            let initials = '';
            if (userDataName) {
                const names = userDataName.split(' ');
                if (names.length >= 2) {
                    initials = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
                } else if (names.length === 1) {
                    initials = names[0].slice(0, 2).toUpperCase();
                }
            }
            return initials;
        }

        return (
            <>
                <Modal show={showUserModal} onHide={() => setShowUserModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                    <Modal.Header className='bg-red text-white'>
                        <Modal.Title>Controle de Usuário</Modal.Title>
                        <button className='btn-close btn-close-white' onClick={() => setShowUserModal(false)} />
                    </Modal.Header>
                    <Modal.Body className="py-3 d-flex flex-column justify-content-center">
                        <Card className="my-3 ">
                            <Card.Header className="d-flex justify-content-between">
                                <h6 className="text-muted fw-bold mb-0">Dados do Usuário</h6>
                                <span>Cargo atual <span className="text-muted">{selectedUser.role === 'USER' ? 'Usuário' : 'Administrador'}</span></span>
                            </Card.Header>
                            <Card.Body>
                                <Row className="w-100 px-2">
                                    <Col xs={2} className="d-flex align-items-center justify-content-center p-0">
                                        <div className="rounded-circle  bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center border" style={{ width: '60px', height: '60px' }}>
                                            <span style={{ fontSize: '1.7rem' }}>{fetchInitials(selectedUser.name)}</span>
                                        </div>
                                    </Col>
                                    <Col xs={10} className="ps-3 p-0 d-flex align-items-center">
                                        <div className="lh-sm d-flex">
                                            <span className="d-flex flex-column">
                                                <span>Nome do usuário é {selectedUser.name}</span>
                                                <span>
                                                    Email
                                                    <a
                                                        className="text-muted ms-2"
                                                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedUser.email}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {selectedUser.email}
                                                    </a>
                                                </span>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <InputGroup hasValidation>
                            <Form.Label className="d-flex flex-column w-100">Altere o Cargo
                                <Form.Select className={`${errorMessages.role && 'is-invalid'} rounded-start`} defaultValue={selectedRole.role} value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                    <option hidden>Selecione o cargo que deseja...</option>
                                    <option disabled value={selectedUser.role}>{selectedUser.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</option>
                                    <option value={selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN'}>{selectedUser.role === 'ADMIN' ? 'Usuário' : 'Administrador'}</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" className="ms-1">
                                    {errorMessages && errorMessages.role && <AlertIcon size="14" currentColor={"currentcolor"} />} {errorMessages ? errorMessages.role : null}
                                </Form.Control.Feedback>
                            </Form.Label>
                        </InputGroup>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='float-end' variant='red' onClick={() => {

                            if (selectedUser.role == selectedRole) {
                                setErrorMessages({ role: 'O usuário já possuí o cargo selecionado' })
                                return;
                            }

                            setConfirmChangesModalData({ title: 'Alterar Permissão', message: 'Deseja realmente Alterar a permissão desse usuário?' });
                            setShowConfirmChangesModal(true);
                        }}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ConfirmChangesModal
                    showConfirmChangesModal={showConfirmChangesModal}
                    setShowConfirmChangesModal={setShowConfirmChangesModal}
                    handleConfirmChanges={handleConfirmChangesModal}
                    confirmChangesModalData={confirmChangesModalData}
                />


            </>

        )
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Usuários</h3>
                    <a type='button' className='btn btn-outline-danger ms-auto' onClick={() => setShowModalPDF(true)}><PdfIcon /></a>

                </Card.Header>
                <Card.Body>
                    <Table responsive hover bordered>
                        <thead>
                            <tr>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Nome
                                        <SortButton field="name" values={users} setValues={setUsers} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Email
                                        <SortButton field="email" values={users} setValues={setUsers} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Cargo
                                        <SortButton field="role" values={users} setValues={setUsers} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Status
                                        <SortButton field="status" values={users} setValues={setUsers} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((user) => (
                                <tr key={user.userId} onDoubleClick={() => {
                                    if (userData && userData.userId === user.userId) {
                                        return;
                                    }
                                    setErrorMessages({});
                                    setShowUserModal(true);
                                    setSelectedUser(user);
                                }}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role == 'ADMIN' ? 'Administrador' : 'Usuário'}</td>
                                    <td>{user.status == 'ACTIVE' ? 'Ativo' : 'Inativo'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination
                        totalItems={users.length}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />

                </Card.Body>
            </Card>

            <ModalPdf setShowModalPDF={setShowModalPDF} showsModalPDF={showsModalPDF} currentItems={users} type={'user'} />


            {renderUserModal()}
        </>
    )
}

export default UserIndex;