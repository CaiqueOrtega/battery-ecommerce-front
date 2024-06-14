import React from 'react';
import { AlertIcon, CheckIcon } from '../../assets/icons/IconsSet';
import { Row, Col } from 'react-bootstrap';
const AlertErrorOrSuccess = ({ errorMessages, successMessage }) => {
    return (
        errorMessages?.general || errorMessages?.serverError || successMessage != '' && successMessage !== null && successMessage !== undefined ? (
            <Row className={`lh-sm g-0 msg alert ${!successMessage ? 'alert-danger' : 'alert-success'} d-flex align-items-centerW mb-0`}>
                <Col className="col-auto me-2">
                    {successMessage
                        ? (<CheckIcon />)
                        : (<AlertIcon size={"16"} currentColor={"#69282f"} />)
                    }
                </Col>

                <Col>
                    <span >
                        {errorMessages?.general ? errorMessages.general : errorMessages?.serverError ? errorMessages.serverError : successMessage}
                    </span>
                </Col>
            </Row>
        ) : null
    );
}

export default AlertErrorOrSuccess;
