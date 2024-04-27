import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';

function ConfirmChangesModal({ showConfirmChangesModal, setShowConfirmChangesModal, handleConfirmChanges, confrimChangesModalData }) {
    const [confirmClicked, setConfirmClicked] = useState(false);


    const handleConfirm = async () => {
        setShowConfirmChangesModal(false);
        setConfirmClicked(true);
    };

    if (!confrimChangesModalData) return null;

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
                    {confrimChangesModalData.title}
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {confrimChangesModalData.message}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowConfirmChangesModal(false)}>Fechar</Button>
                <Button variant="red" onClick={handleConfirm}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmChangesModal;
