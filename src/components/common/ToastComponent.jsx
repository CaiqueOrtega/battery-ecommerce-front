import { Col, Row, Toast } from "react-bootstrap";
import { useEffect, useState } from "react";

function ToastComponent({ icon, message, showToast, setShowToast }) {
    const toggleShow = () => setShowToast(!showToast);

    const slideInAnimation = {
        animation: 'slide-in 0.5s forwards'
    };

    const fadeOutAnimation = {
        animation: 'fade-out 0.5s forwards'
    };

    const keyframes = `
        @keyframes slide-in {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes fade-out {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            <Toast
                className="bg-white"
                onClose={toggleShow}
                show={showToast}
                style={showToast ? slideInAnimation : fadeOutAnimation}
            >
                <a type="button" className="btn-close position-absolute end-0 me-2 mt-2" onClick={() => setShowToast(false)}></a>
                <Toast.Body className="py-3 px-4">
                    <Row>
                        <Col xs={2} className="d-flex justify-content-center align-items-center">
                            {icon}
                        </Col>
                        <Col className="d-flex align-items-center lh-sm">
                            <span className="text-muted" style={{ fontSize: 16 }}>
                                {message}
                            </span>
                        </Col>
                    </Row>
                </Toast.Body>
            </Toast>
        </>
    );
}

export default ToastComponent;
