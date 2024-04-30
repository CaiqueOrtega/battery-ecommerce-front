import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

function ConfirmChangesModal({ showConfirmChangesModal, setShowConfirmChangesModal, handleConfirmChanges, confirmChangesModalData }) {
    const [confirmClicked, setConfirmClicked] = useState(false);


    const handleConfirm = async () => {
        setShowConfirmChangesModal(false);
        setConfirmClicked(true);
    };

    if (!confirmChangesModalData) return null;

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
                    {confirmChangesModalData.title}
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {confirmChangesModalData.message}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmChangesModal(false)}>Fechar</Button>
                <Button variant="red" onClick={handleConfirm}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmChangesModal;
