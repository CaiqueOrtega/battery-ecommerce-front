import React, { useContext, useState } from "react";
import { Card, Table, Modal, Button, Form, InputGroup } from "react-bootstrap";
import { AlertIcon, PdfIcon } from "../../../assets/icons/IconsSet";
import UserService from "../../../services/users/UsersServices";
import ConfirmChangesModal from "../../../components/common/ConfirmChangesModal";
import { AuthContext } from '../../../context/AuthProvider';
import Pagination from "../../../components/common/Pagination";
import ModalPdf from '../../../services/pdf/Report'
import SortButton from "../../../components/common/SortButton";

function UserIndex({ users, setUsers }) {
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

        return (
            <>
                <Modal show={showUserModal} onHide={() => setShowUserModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                    <Modal.Header className='bg-red text-white'>
                        <Modal.Title>Controle de Usuário</Modal.Title>
                        <button className='btn-close btn-close-white' onClick={() => setShowUserModal(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <div className="my-3 ">
                            <hr />
                            <h6> <span className='fw-bold'>Nome do usuário: </span>{selectedUser.name}</h6>
                            <h6> <span className='fw-bold'>Email: </span>{selectedUser.email}</h6>
                            <h6> <span className='fw-bold'>Cargo: </span>{selectedUser.role}</h6>
                            <hr />
                        </div>

                        <InputGroup hasValidation>
                            <Form.Select className={`${errorMessages.role && 'is-invalid'} rounded-start`} defaultValue={selectedRole.role} value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                                <option hidden>Selecione o cargo que deseja...</option>
                                <option disabled value={selectedUser.role}>{selectedUser.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</option>
                                <option value={selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN'}>{selectedUser.role === 'ADMIN' ? 'Usuário' : 'Administrador'}</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" className="ms-1">
                                {errorMessages && errorMessages.role && <AlertIcon size="14" currentColor={"currentcolor"} />} {errorMessages ? errorMessages.role : null}
                            </Form.Control.Feedback>
                        </InputGroup>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='float-end' variant='red' onClick={() => {

                            if (selectedUser.role == selectedRole) {
                                setErrorMessages({ role: 'O usuário já possuí o cargo selecionado' })
                                return;
                            }

                            console.log('teste')
                            setConfirmChangesModalData({ title: 'Alterar Permissão', message: 'Deseja realmente Alterar a permissão desse usuário?' });
                            setShowConfirmChangesModal(true);
                            console.log(showConfirmChangesModal)
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