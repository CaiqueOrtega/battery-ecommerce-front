import { Modal, Button } from 'react-bootstrap';


function ConfirmChanges({ showConfirmChangesModal, setShowConfirmChangesModal, action, handleConfirmChanges, setUpdateTable, field }) {
    const confirmMessage = action === 'update' 
    ? 'Deseja realmente editar este produto?' 
    : action === 'userRoleChange'
        ? `Deseja Realmente alterar o cargo desse usuário de ${field.role} para ${field.roleChange}`
        : `Deseja realmente excluir ${field.fieldDeleted}?`;

    return (
        <Modal show={showConfirmChangesModal} onHide={() => setShowConfirmChangesModal(false)} backdrop='false' centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {action === 'update' 
                    ? 'Confirmar Edição de Bateria ' 
                    : action === 'userRoleChange' 
                    ? 'Confirmar alteração de Cargo'
                    : 'Confirmar exclusão de Bateria '}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {confirmMessage}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmChangesModal(false)}>Fechar</Button>
                <Button variant="red" onClick={async () => {
                    await handleConfirmChanges()
                    setUpdateTable(prevValue => !prevValue);
                }}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}



export default ConfirmChanges;