import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

<<<<<<< HEAD
function ConfirmChangesModal({ showConfirmChangesModal, setShowConfirmChangesModal, handleConfirmChanges, confirmChangesModalData }) {
=======
function ConfirmChangesModal({ showConfirmChangesModal, setShowConfirmChangesModal, action, handleConfirmChanges, field }) {
>>>>>>> parent of 71bb5c8 (feat: Add logic to dynamically render data, tabble and modals)
    const [confirmClicked, setConfirmClicked] = useState(false);

    const confirmMessage = action === 'update' 
    ? 'Deseja realmente editar este produto?' 
    : action === 'userRoleChange'
        ? `Deseja Realmente alterar o cargo desse usuário de ${field.role} para ${field.roleChange}`
        : `Deseja realmente excluir ${field.fieldDeleted}?`;

    const handleConfirm = async () => {
        setShowConfirmChangesModal(false);
        setConfirmClicked(true);
    };

<<<<<<< HEAD
    if (!confirmChangesModalData) return null;

=======
>>>>>>> parent of 71bb5c8 (feat: Add logic to dynamically render data, tabble and modals)
    return (
        <Modal show={showConfirmChangesModal} onHide={() => setShowConfirmChangesModal(false)} backdrop='false' centered
            onExited={async () => {
                if (confirmClicked) {
                    await handleConfirmChanges();
                    setConfirmClicked(false);
                }
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>
<<<<<<< HEAD
                    {confirmChangesModalData.title}
=======
                    {action === 'update' 
                    ? 'Confirmar Edição' 
                    : action === 'userRoleChange' 
                    ? 'Confirmar alteração de Cargo'
                    : 'Confirmar exclusão'}
>>>>>>> parent of 71bb5c8 (feat: Add logic to dynamically render data, tabble and modals)
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
<<<<<<< HEAD
                {confirmChangesModalData.message}
=======
                {confirmMessage}
>>>>>>> parent of 71bb5c8 (feat: Add logic to dynamically render data, tabble and modals)
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmChangesModal(false)}>Fechar</Button>
                <Button variant="red" onClick={handleConfirm}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmChangesModal;
