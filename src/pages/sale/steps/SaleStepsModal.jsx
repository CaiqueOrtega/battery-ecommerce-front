import { AddressFormContentStep, AddressListContentStep } from './AddressContentStep';
import { Modal } from "react-bootstrap";
import { useMemo } from "react";

function SaleStepsModal({ showSaleStepsModal, setShowSaleStepsModal, isLoggedIn, addressValues, address, userData }) {
    
    const modalContent = useMemo(() => {
        if (!isLoggedIn) {
            return <NotLoggedContentStep />
        } else if (address?.length < 0) {
            return <AddressFormContentStep addressValues={addressValues} userId={userData?.userId} />
        }else if(address?.length >= 0){
            return <AddressListContentStep address={address}/>
        }
    }, [address, isLoggedIn]);


    return (
        <Modal show={showSaleStepsModal} onHide={() => setShowSaleStepsModal(false)} backdrop="static" keyboard={false}>
            <button className='btn-close position-absolute end-0 me-2 mt-2 z-3' onClick={() => setShowSaleStepsModal(false)} />
            {modalContent}
        </Modal>
    )
}

export default SaleStepsModal