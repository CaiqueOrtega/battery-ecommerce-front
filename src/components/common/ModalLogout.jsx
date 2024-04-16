import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';


function ModalLogout({ showModal, setShowModal, logout }) {

        return (
            <Modal show={showModal} onHide={() => setShowModal(false)} keyboard={false} backdrop='false'>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Sair da Conta
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Deseja Realmente sair?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Fechar</Button>
                    <Button variant="red" onClick={logout}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        );
}

export default ModalLogout;