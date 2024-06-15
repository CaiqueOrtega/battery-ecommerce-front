import { Modal, Button } from "react-bootstrap";
import LoginSignUpButton from "./LoginSignUpButton";
import { ShoppingCartIcon } from "../../assets/icons/IconsSet";

function ModalNotLogged({ showModalNotLogged, setShowModalNotLogged }) {
    return (
        <Modal show={showModalNotLogged} onHide={() => setShowModalNotLogged(false)} centered>
          
                <button className='btn-close position-absolute end-0 me-2 mt-2 z-3' onClick={() => setShowModalNotLogged(false)} />
 
            <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-5">
                <div className="text-center my-4">
                    <ShoppingCartIcon style={{ fontSize: '3rem', color: '#f39c12' }} />
                    <h5 className="mt-3">Entre na Sua Conta para Continuar </h5>
                    <p className="text-muted">Faça login ou cadastre-se para continuar com sua compra!</p>
                </div>

                <div className="w-75 mt-3 mb-4">
                    <LoginSignUpButton
                        classNameBtnLogin="btn btn-yellow w-100 mb-2"
                        classNameBtnSignUp="btn btn-outline-danger w-100"
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ModalNotLogged;
