import { FormControl, Form } from "react-bootstrap";
import { useEffect, useRef } from 'react';

const FormGroupWithIcon = ({ icon, type, placeholder, mb, value, onChange, feedback }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus()
    }, [feedback]);
    
    return (

        <div className={'mb-3 ' + mb + ' align-items-center d-flex position-relative flex-grow-1 flex-wrap'} >
            <FormControl
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className={`ps-5 py-2 border-0 bg-main rounded-1 ${feedback ? 'is-invalid' : ' '}`}
                required
                ref={inputRef}
            />
            {icon}
            {feedback && (
                <Form.Control.Feedback className="position-absolute bottom-100 flex-shrink-1" type="invalid" >{feedback}</Form.Control.Feedback>
            )}
        </div>
    );
};

export default FormGroupWithIcon;
