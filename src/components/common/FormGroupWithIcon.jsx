import { FormControl, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState, useRef } from 'react';
import { AlertIcon } from "../../assets/icons/IconsSet";

const FormGroupWithIcon = ({ icon, type, placeholder, mb, value, onChange, feedback, bgBorder, disable, className, disableRequired }) => {
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
                    <span className="text-danger small"><AlertIcon size="14" currentColor={"currentcolor"} /> {feedback} </span>
                )
            }
            <div className={`${mb} align-items-center d-flex position-relative flex-grow-1`} >
                <FormControl
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    className={`ps-5 py-2 ${className} ${bgBorder ? 'bg-main border-0' : ''} rounded-1 ${feedback ? 'is-invalid' : ''}`}
                    ref={inputRef}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={disableRequired == true ? false : true}
                    disabled={disable}
                />
                {icon}
            </div>
        </>
    );
};


export default FormGroupWithIcon;
