import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { AlertIcon } from '../../assets/icons/IconsSet';
import { withMask } from 'use-mask-input';


const InputWithFloatingLabel = ({ type, labelText, onBlurData, onFocusData, inputId, feedback, value, onChange, disableRequired, maxLength, pattern, disable, mask }) => {
    const [inputFocused, setInputFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (feedback && inputRef.current) {
            inputRef.current.focus();
        }

    }, [feedback]);

    useEffect(()=>{
        if(value){
            setInputFocused(true)
        }
    },[value])

    const handleBlur = (e) => {
        if (!e.target.value) {
            setInputFocused(false);
        }
        if (onBlurData && Object.keys(onBlurData).length !== 0) {
            onBlurData.function();
        }
    }

    const handleFocus = () => {
        if (onFocusData && Object.keys(onFocusData).length !== 0) {
            onFocusData.function(onFocusData.param);
        }
        setInputFocused(true);
    }

    useEffect(() => {
        if (mask) {
            withMask(mask)(inputRef.current);
        }
    }, []);


    return (
        <section>
            <div className='position-relative' style={{ height: '42px' }}>
                <Form.Control
                    id={inputId}
                    className='py-2'
                    type={type}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={value}
                    onChange={onChange}
                    ref={inputRef}
                    disabled={disable}
                    maxLength={maxLength}
                    pattern={pattern}
                    required={disableRequired === true ? false : true}
                />
                <label
                    htmlFor={inputId}
                    className={`position-absolute ${inputId === 'cpf' && !inputFocused ? 'pe-5' : ''} text-muted ${disable ? '' : 'bg-white'} `}
                    style={{
                        top: inputFocused ? '-19px' : '50%',
                        left: inputFocused ? '0px' : '8px',
                        transition: 'top 0.2s ease',
                        transform: inputFocused ? 'translateY(0) scale(0.75)' : 'translateY(-50%)',
                        cursor: inputFocused ? 'default' : 'text'
                    }}
                >
                    {labelText}
                </label>
            </div>
            {
                feedback && inputFocused && (
                    <span className="text-danger small mb-5">
                        <AlertIcon size={"14"} currentColor={"currentcolor"} />
                        <span className="ms-1">{feedback}</span>

                    </span>
                )
            }
        </section>
    );
};

export default InputWithFloatingLabel;
