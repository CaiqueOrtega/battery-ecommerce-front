import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AlertErrorOrSuccess from './AlertErrorOrSuccess';
import { useBatteryCartProvider } from '../../context/BatteryCartProvider';
import { useGlobalDataProvider } from '../../context/GlobalDataProvider';

function ModalLogout({ showLogoutModal, setShowLogoutModal, logout }) {
    const [errorMessages, setErrorMessages] = useState();
    const {resetCartData} = useBatteryCartProvider();
    const { resetAddress } = useGlobalDataProvider();

    const handleLogout = () => {
        if (logout()) {
            setShowLogoutModal(false);
            resetAddress();
            resetCartData()
        } else {
            console.log('entrou6')
            setErrorMessages({ general: "Houve um problema ao tentar sair. Por favor, tente novamente mais tarde." });
        }
    };

    return (
        <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} keyboard={false} backdrop='static'>
            <Modal.Header closeButton>
                <Modal.Title>
                    Sair da Conta
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <AlertErrorOrSuccess errorMessages={errorMessages} />
                Deseja Realmente sair?
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>Fechar</Button>
                <Button variant="red" onClick={handleLogout}>Confirmar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalLogout;