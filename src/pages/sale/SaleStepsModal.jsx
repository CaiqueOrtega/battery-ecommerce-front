import SelectedAddressContent from './steps/selectedAddress/SelectedAddressContent';
import SelectedPaymentContent from './steps/selectedPaymentMethod/SelectedPaymentContent';
import NotLoggedContentStep from './steps/NotLoggedContentStep';
import { Modal, ModalHeader } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react";
import ConfirmStepsContent from './steps/confirmSteps/ConfirmStepsContent';
import './salesSteps.css'

function SaleStepsModal({ showSaleStepsModal, setShowSaleStepsModal, isLoggedIn, addressValues, address, setAddress, setAddressValues, freightValues, userData, steps, setSteps, batteryCart, setBatteryCart }) {
    const [optionsSelected, setOptionsSelected] = useState({ address: {}, payment: {}, userId: userData?.userId })
    const [progressBarSteps, setProgressBarSteps] = useState(1);
    const [isDelaying, setIsDelaying] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(true);
    const [isAnimationCircle, setIsAnimationCircle] = useState(false);
    const [isAnimationReversedCircle, setIsAnimationReversedCircle] = useState(false);
    const [successSale, setSuccessSale] = useState(false);

    const handleNextStep = () => {
        setIsAnimationCircle(true)
        setIsDelaying(false);
        if (progressBarSteps < 3) {
            setProgressBarSteps(progressBarSteps + 1);
        }
        setTimeout(() => {
            setIsAnimationCircle(false)
        }, 600);
    };

    const handlePreviousStep = () => {
        setIsAnimationReversedCircle(true)
        if (progressBarSteps > 1) {
            setIsDelaying(true);
            setProgressBarSteps(progressBarSteps - 1);
        }
        setTimeout(() => {
            setIsAnimationReversedCircle(false)
        }, 300);
    };

    const modalContent = useMemo(() => {
        if (!isLoggedIn) {
            setShowProgressBar(false);
            return <NotLoggedContentStep setShowSaleStepsModal={setShowSaleStepsModal} />
        }

        switch (steps) {
            case 'address':
                return <SelectedAddressContent
                    address={address}
                    setAddress={setAddress}
                    addressValues={addressValues}
                    setAddressValues={setAddressValues}
                    userData={userData}
                    handleNextStep={handleNextStep}
                    setSteps={setSteps}
                    setShowProgressBar={setShowProgressBar}
                    showProgressBar={showProgressBar}
                    setOptionsSelected={setOptionsSelected}
                    optionsSelected={optionsSelected}
                />
            case 'payment':
                return <SelectedPaymentContent
                    userData={userData}
                    handleNextStep={handleNextStep}
                    handlePreviousStep={handlePreviousStep}
                    setSteps={setSteps}
                    setShowProgressBar={setShowProgressBar}
                    showProgressBar={showProgressBar}
                    setOptionsSelected={setOptionsSelected}
                    optionsSelected={optionsSelected}
                />
            case 'confirm':
                return <ConfirmStepsContent
                    batteryCart={batteryCart}
                    freightValues={freightValues}
                    optionsSelected={optionsSelected}
                    setSteps={setSteps}
                    setBatteryCart={setBatteryCart}
                    setShowProgressBar={setShowProgressBar}
                    handlePreviousStep={handlePreviousStep}
                    setSuccessSale={setSuccessSale}
                />

            default: <div>Funcionalidade não Encontrada...</div>
        }
    }, [isLoggedIn, steps, showProgressBar, address, addressValues, batteryCart, freightValues]);
;

    return (
        <Modal centered show={showSaleStepsModal} onHide={() => setShowSaleStepsModal(false)} backdrop="static" keyboard={false} dialogClassName="modal-sale" contentClassName='modal-sale-content'
        >
            <ModalHeader className='border-0 position-relative mb-0'>
                <button className='btn-close position-absolute end-0 top-0 mt-1 me-1 z-3' onClick={() => setShowSaleStepsModal(false)} />
                {showProgressBar && (
                    <section className="px-4 pt-4 w-100">
                        <div className="progress-container position-relative d-flex align-items-center">
                            <div className="position-absolute d-flex justify-content-between w-100">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-circle text-white d-flex justify-content-center align-items-center 
                                             ${index < progressBarSteps ? (index === progressBarSteps - 1 && isAnimationCircle ? 'filled-circle' : 'bg-primary') : isAnimationReversedCircle && index === progressBarSteps ? 'filled-reversed-circle' : 'bg-body-secondary'}`}
                                        style={{ width: 45, height: 45 }}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                            </div>

                            <div className="progress w-100">
                                <div
                                    className={`progress-bar progress-bar-sale ${isDelaying ? 'retrocesso' : ''}`}
                                    role="progressbar"
                                    style={{ width: `${((progressBarSteps - 1) / (3 - 1)) * 100}%` }}
                                    aria-valuenow={progressBarSteps}
                                    aria-valuemin="1"
                                    aria-valuemax={3}
                                />
                            </div>
                        </div>
                    </section>
                )}
            </ModalHeader>

            {modalContent}
        </Modal>
    )
}


export default SaleStepsModal