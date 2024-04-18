import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';


function ConfirmChanges({ showConfirmChangesModal, setShowConfirmChangesModal, action, handleConfirmChanges, setUpdateTable }) {
    const confirmMessage = action === 'update' ? 'Deseja realmente editar este produto?' : 'Deseja realmente excluir este produto?';

    return (
        <Modal show={showConfirmChangesModal} onHide={() => setShowConfirmChangesModal(false)} backdrop='false' centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {action === 'update' ? 'Deseja realmente editar ' : 'Deseja realmente excluir '}
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