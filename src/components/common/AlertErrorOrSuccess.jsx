import React from 'react';
import { AlertIcon, CheckIcon } from '../../assets/icons/IconsSet';

const AlertErrorOrSuccess = ({ errorMessages, successMessage }) => {
    return (
        errorMessages.general || successMessage ? (
            <div className={`msg alert ${errorMessages.general ? 'alert-danger' : 'alert-success'} mb-0 d-flex align-items-center mb-3`}>
                {successMessage
                    ? (<CheckIcon />)
                    : (<AlertIcon size={"16"} currentColor={"#69282f"} />)
                }

                <span className='ms-2'>
                    {errorMessages.general ? errorMessages.general : successMessage}
                </span>
            </div>
        ): null
    );
}

export default AlertErrorOrSuccess;
