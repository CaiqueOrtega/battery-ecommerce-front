import { useEffect, useState } from "react";
import { Toast, Button } from "react-bootstrap"
import { AlertIcon } from "../assets/icons/IconsSet";

function ToastError({ showToastError, setShowToastError, errorMessages, setErrorMessages }) {

    useEffect(() => {
        if (errorMessages?.general) {
                setShowToastError(true)
        }
    }, [errorMessages])

    useEffect(() => {
        if (!showToastError) {
            setErrorMessages({})
        }
    }, [showToastError])

    return (
        <Toast className="position-fixed bottom-0 end-0 mb-2 me-2"
            onClose={() => setShowToastError(!showToastError)}
            show={showToastError} animation={true}>
            <Toast.Header>
                <span>
                    <AlertIcon size={'15px'} currentColor={'#69282f'} />
                </span>
                <span className="me-auto ms-2" style={{ color: '#58151c' }}>Ops! ocorreu um erro...</span>
            </Toast.Header>
            <Toast.Body>
                {errorMessages.general}
            </Toast.Body>
        </Toast>
    );
}

export default ToastError;