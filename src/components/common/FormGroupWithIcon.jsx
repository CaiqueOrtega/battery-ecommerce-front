import { FormControl, Form, FloatingLabel } from "react-bootstrap";
import { useEffect, useState, useRef } from 'react';
import { AlertIcon } from "../../assets/icons/IconsSet";
import { withMask } from 'use-mask-input';

function FormGroupWithIcon({ icon, type, placeholder, value, onChange, feedback, bgBorder, disable, className, disableRequired, maxLength, onBlurData, onFocusData, pattern, mask }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <section className="text-wrap">
            <div className={`align-items-center d-flex position-relative flex-grow-1`} >

                <RenderInputFormControl
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    className={className}
                    disableRequired={disableRequired}
                    disable={disable}
                    maxLength={maxLength}
                    pattern={pattern}
                    setIsFocused={setIsFocused}
                    onBlurData={onBlurData}
                    onFocusData={onFocusData}
                    bgBorder={bgBorder}
                    feedback={feedback}
                    mask={mask}
                />

                {icon}
            </div>
            {
                feedback && isFocused && (
                    <span className="text-danger small mb-5">
                        <AlertIcon size={"14"} currentColor={"currentcolor"} />
                        <span className="ms-1">{feedback}</span>

                    </span>
                )
            }
        </section>
    );
};



function RenderInputFormControl({ value, onChange, type, placeholder, className, disableRequired, disable, maxLength, pattern, setIsFocused, onBlurData, onFocusData, bgBorder, feedback, mask }) {
    const inputRef = useRef(null);

    useEffect(() => {
        if (feedback && inputRef.current) {
            inputRef.current.focus();
        }

    }, [feedback]);

    useEffect(() => {
        if (mask) {
            withMask(mask)(inputRef.current);
        }
    }, []);


    const onBlur = () => {
        if (onBlurData && Object.keys(onBlurData).length !== 0) {
            onBlurData.function();
        }

        setIsFocused(false)
    }

    const onFocus = () => {
        if (onFocusData && Object.keys(onFocusData).length !== 0) {
            onFocusData.function(onFocusData.param);
        }

        setIsFocused(true)
    }

    return (
        <FormControl
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            className={`ps-5 py-2 ${className} ${bgBorder ? 'bg-main border-0' : ''} rounded-1 ${feedback ? 'is-invalid' : ''} custom-mask-color`}
            ref={inputRef}
            onFocus={onFocus}
            onBlur={onBlur}
            required={disableRequired === true ? false : true}
            disabled={disable}
            maxLength={maxLength}
            pattern={pattern}
        />
    )
}

export default FormGroupWithIcon;
