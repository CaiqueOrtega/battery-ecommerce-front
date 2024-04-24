import React, { useContext, useState } from "react";
import { Card, Table, Modal, Button, Form, InputGroup } from "react-bootstrap";
import { AlertIcon } from "../../../assets/icons/IconsSet";
import { UserContext } from "../../../context/UsersProvider";
import UserService from "../../../services/users/UsersServices";
import ConfirmChanges from "../../../components/common/ConfirmChangesModal";
import { AuthContext } from '../../../context/AuthProvider';

function UserIndex() {
    const { users, setUpdateTable } = useContext(UserContext)
    const { userData } = useContext(AuthContext);

    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUser, setSelectedUser] = useState(null)

    const [prevSelectedRole, setPrevSelectedRole] = useState('');
    const [fieldChange, setFieldChange] = useState({});

    const { changeRole, errorMessages, setErrorMessages } = UserService()


    const handleConfirmChangesModal = async () => {
        const response = await changeRole(selectedUser.userId, selectedRole);

        if (response.success) {
            setShowConfirmChangesModal(false);
            setShowUserModal(false);
            setUpdateTable(prevValue => !prevValue);
        }
    }

    const renderUserAdminModal = () => {
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
                                <option disabled value={selectedUser.role}>{selectedUser.role === 'ADMIN' ? 'Adiministrador' : 'Usuário'}</option>
                                {selectedUser.role === 'ADMIN'
                                    ? (<option value="USER">Usuário</option>)
                                    : (<option value="ADMIN">Adiministrador</option>)}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid" className="ms-1">
                                <AlertIcon size="14" currentColor={"currentcolor"} /> {errorMessages ? errorMessages.role : null}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='float-end' variant='red' onClick={() => {

                            if (prevSelectedRole === selectedRole) {
                                setErrorMessages({ role: 'O usuário já possuí o cargo selecionado' })
                                return;
                            }

                            setPrevSelectedRole(selectedRole);

                            setFieldChange({ role: selectedUser.role, roleChange: selectedRole })
                            setShowConfirmChangesModal(true);
                        }}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <ConfirmChanges
                    showConfirmChangesModal={showConfirmChangesModal}
                    setShowConfirmChangesModal={setShowConfirmChangesModal}
                    action={'userRoleChange'}
                    handleConfirmChanges={handleConfirmChangesModal}
                    setUpdateTable={setUpdateTable}
                    field={fieldChange}
                />
            </>

        )
    }


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Usuários</h3>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover bordered>
                        <thead>
                            <tr>
                                <th className='bg-table-header'>Nome</th>
                                <th className='bg-table-header'>Email</th>
                                <th className='bg-table-header'>Cargo</th>
                                <th className='bg-table-header'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId} onDoubleClick={() => {
                                    if(userData && userData.userId === user.userId){
                                        return;
                                    }
                                    setErrorMessages({});
                                    setShowUserModal(true);
                                    setSelectedUser(user);
                                    setPrevSelectedRole(user.role);
                                }}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className='text-end'>{user.role}</td>
                                    <td className='text-end'>{user.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            {renderUserAdminModal()}
        </>
    )
}

export default UserIndex;