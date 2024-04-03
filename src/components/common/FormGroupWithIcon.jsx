import { FormControl } from "react-bootstrap";

const FormGroupWithIcon = ({ icon, type, placeholder, mb, value, onChange}) => {
    return (
        <div className={'mb-' + mb + ' d-flex align-items-center position-relative'} >
            <FormControl value={value} onChange={onChange} type={type} placeholder={placeholder} className='ps-5 py-2 border-0 bg-main rounded-1' />
            {icon}
        </div>
    );
};

export default FormGroupWithIcon;