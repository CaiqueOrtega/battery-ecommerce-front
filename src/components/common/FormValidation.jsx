
function FormValidations(){
    const isEquals = (currentValues, prevValues, setPrevValues, setErrorMessages ) => {
        console.log('current Values', currentValues)
        console.log('prevValues', prevValues)
    
        if (currentValues) {
            const keys = new Set([...Object.keys(currentValues), ...Object.keys(prevValues)]);
            const isEqual = Array.from(keys).every(key => currentValues[key] === prevValues[key]);
    
            if (isEqual) {
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados.'
                }));
            }
            setPrevValues(currentValues);
    
            console.log('teste is equals', isEquals)
            return isEqual;
        }
    };

    return{isEquals}
}

export default FormValidations;