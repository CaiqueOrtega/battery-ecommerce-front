import React, { useContext, useState } from "react";
import { Card, Table, Modal, Button } from "react-bootstrap";
import { UserContext } from "../../context/UsersProvider";
import UserService from "../../services/users/UsersServices";

function UserIndex() {
    const { users, setUpdateTable } = useContext(UserContext)
    const [selectedUser, setSelectedUser] = useState(null)

    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [lastClickedUser, setLastClickedUser] = useState(null);
    const [clickTimeout, setClickTimeout] = useState(null);

    const { turnAdmin } = UserService()


    const handleRowClick = (user) => {

        if (lastClickedUser === user) {
            setSelectedUser(user);
            setShowUserModal(true);
            clearTimeout(clickTimeout);
            setLastClickedUser(null);

        } else {
            setLastClickedUser(user);

            const newClickTimeout = setTimeout(() => {
                setLastClickedUser(null);
            }, 300);

            setClickTimeout(newClickTimeout);
        }
    }

    const renderUserAdminModal = () => (
        <>
            <Modal size="lg" show={showUserModal} onHide={() => setShowUserModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>Transformar usuário em administrador</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowUserModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    Deseja transformar usuário: {selectedUser ? selectedUser.name : ''} em administrador?
                </Modal.Body>

                <Modal.Footer>
                    <Button className='float-end' variant='red' onClick={() => {setShowConfirmChangesModal(true)}}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmChangesModal} onHide={() => setShowConfirmChangesModal(false)} backdrop='false' centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Confirmar mudanças
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Realmente deseja continuar com a operação   
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmChangesModal(false)}>Fechar</Button>
                    <Button variant="red" onClick={async () => {
                        const response = await turnAdmin(selectedUser.userId)
                        if(response === 200){
                            setUpdateTable(prevValue => !prevValue);
                            setShowConfirmChangesModal(false)
                            setShowUserModal(false)
                        }
                        
                    }}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        </>
    )


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Usuarios</h3>
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
                                <tr key={user.userId} onClick={() => handleRowClick(user)}>
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