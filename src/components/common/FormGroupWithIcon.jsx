import { FormControl, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState, useRef } from 'react';
import { AlertIcon } from "../../assets/icons/IconsSet";

const FormGroupWithIcon = ({ icon, type, placeholder, mb, value, onChange, feedback, focusOnError }) => {
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);


    useEffect(() => {
        if (feedback && inputRef.current) {
            inputRef.current.focus();
        }
    }, [feedback]);
    
    return (
        <>
            {
                feedback && isFocused && (
                    <span className="text-danger small mb-1"><AlertIcon size="14" currentColor={"currentcolor"} /> {feedback} </span>
                )
            }

            <div className={`${mb} align-items-center d-flex position-relative flex-grow-1`} >
                <FormControl
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    className={`ps-5 py-2 border-0 bg-main rounded-1 ${feedback && 'is-invalid'}`}
                    ref={inputRef}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    
                />
                {icon}
            </div>
        </>
    );
};


export default FormGroupWithIcon;
