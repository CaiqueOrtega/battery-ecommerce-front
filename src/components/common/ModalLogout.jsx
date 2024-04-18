import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';


function ModalLogout({ showLogoutModal, setShowLogoutModal, logout }) {

    return (
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} keyboard={false} backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sair da Conta
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                Deseja Realmente sair?
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Fechar</Button>
                <Button variant="red" onClick={logout}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalLogout;