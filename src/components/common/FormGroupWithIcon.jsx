import { FormControl, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState, useRef } from 'react';
import { AlertIcon } from "../../assets/icons/IconsSet";

const FormGroupWithIcon = ({ icon, type, placeholder, mb, value, onChange, feedback, bgBorder, disable, className, disableRequired, maxLength, onBlurData, onFocusData, pattern }) => {
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {

        if (feedback && inputRef.current) {
            inputRef.current.focus();
        }
    }, [feedback]);

    const onBlur = () =>{
        console.log('teste blur', onBlurData)
        if(onBlurData && Object.keys(onBlurData).length !== 0){
            onBlurData.function();
        }

            setIsFocused(false)
    }

    const onFocus = () =>{
        console.log('teste focus', onFocusData)
        if(onFocusData && Object.keys(onFocusData).length !== 0){
            onFocusData.function(onFocusData.param);
        }

            setIsFocused(true)
    }
    
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
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required={disableRequired === true ? false : true}
                    disabled={disable}
                    maxLength={maxLength}
                    pattern={pattern}
                />
                {icon}
            </div>
        </>
    );
};


export default FormGroupWithIcon;
