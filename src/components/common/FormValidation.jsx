
function FormValidations() {
    const isEquals = (currentValues, prevValues, setPrevValues, setErrorMessages) => {
        console.log(currentValues)
        console.log(prevValues)
        if (currentValues) {
            const keys = new Set([...Object.keys(currentValues), ...Object.keys(prevValues)]);
            const isEqual = Array.from(keys).every(key => currentValues[key] === prevValues[key]);

            if (isEqual) {
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados.'
                }));
            }
            setPrevValues(currentValues);
            return isEqual;
        }
    };

    const ExtractNumericValue = (value) => {
        const numericValue = value.toString().replace(/\D/g, '');
        return numericValue;
    };

    return { isEquals, ExtractNumericValue }
}

export default FormValidations;