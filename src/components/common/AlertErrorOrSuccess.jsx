import React from 'react';
import { AlertIcon } from '../../assets/icons/IconsSet';

const AlertErrorOrSuccess = ({ errorMessages }) => (
    errorMessages.general && (
        <div className={`msg alert ${errorMessages.general ? 'alert-danger' : 'alert-success'} mb-0 d-flex align-items-center mb-3`}>
            {errorMessages.success
                ? (<CheckIcon />)
                : (<AlertIcon size={"16"} currentColor={"#69282f"} />)
            }

            <span className='ms-2'>
                {errorMessages.general ? errorMessages.general : errorMessages.success}
            </span>
        </div>
    )
);

export default AlertErrorOrSuccess;
