import React, { useContext, useState } from "react";
import { Card, Table, Modal, Button, Form } from "react-bootstrap";
import { UserContext } from "../../context/UsersProvider";
import UserService from "../../services/users/UsersServices";
import ConfirmChanges from "../../components/common/ConfirmChangesModal";

function UserIndex() {
    const { users, setUpdateTable } = useContext(UserContext)
    const [selectedUser, setSelectedUser] = useState(null)
    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [fieldChange, setFieldChange] = useState({});

    const { changeRole } = UserService()


    const handleConfirmChangesModal = async () => {
        const response = await changeRole(selectedUser.userId, selectedRole);
    }

    const renderUserAdminModal = () => {
        if (!selectedUser) return null;

        return (
            <>
                <Modal show={showUserModal} onHide={() => setShowUserModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                    <Modal.Header className='bg-red text-white'>
                        <Modal.Title>Controle de Usuário: {selectedUser.name}</Modal.Title>
                        <button className='btn-close btn-close-white' onClick={() => setShowUserModal(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Select value={selectedRole}  onChange={(e) => setSelectedRole(e.target.value)}>
                            <option hidden >{selectedUser.role}</option>
                            {selectedUser.role === 'ADMIN'
                                ? (<option value="USER">Usuário</option>)
                                : (<option value="ADMIN">Adiministrador</option>)}
                        </Form.Select>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button className='float-end' variant='red' onClick={() => { 
                            setFieldChange({role: selectedUser.role, roleChange: selectedRole})
                            setShowConfirmChangesModal(true); }}>
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
                                    setShowUserModal(true);
                                    setSelectedUser(user);
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