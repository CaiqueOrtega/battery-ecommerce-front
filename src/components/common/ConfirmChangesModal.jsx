import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

function ConfirmChangesModal({ showConfirmChangesModal, setShowConfirmChangesModal, action, handleConfirmChanges, field }) {
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
                    {action === 'update' 
                    ? 'Confirmar Edição' 
                    : action === 'userRoleChange' 
                    ? 'Confirmar alteração de Cargo'
                    : 'Confirmar exclusão'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {confirmMessage}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmChangesModal(false)}>Fechar</Button>
                <Button variant="red" onClick={handleConfirm}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmChangesModal;
