import { useState, useMemo } from "react";
import { Card, CardBody, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { PaymentCardIcon, PaymentPixIcon, PaymentTicketIcon, ReturnIcon } from "../../../../assets/icons/IconsSet";
import CardContent from "./methods/CardContent";

function SelectedPaymentContent({ setShowSaleStepsModal, handleNextStep, handlePreviousStep, setSteps, setShowProgressBar, showProgressBar, setOptionsSelected, optionsSelected, userData }) {
    const [selectedPaymentCard, setSelectedPaymentCard] = useState(false);

    const paymentMethod = (method) => {
        switch (method) {
            case 'card':
                setSelectedPaymentCard(true)
                break;
            case 'pix':
                handleNextStep()
                setOptionsSelected({ ...optionsSelected, payment: { method: 'pix' } })
                setSteps('confirm');
                break;
            case 'ticket':
                handleNextStep()
                setOptionsSelected({ ...optionsSelected, payment: { method: 'ticket' } })
                setSteps('confirm');
                break;
        }
    };

    const PaymentMethodCards = ({ text, icon, clickMethod }) => {
        return (
            <Card className="mt-2" onClick={() => paymentMethod(clickMethod)} style={{ cursor: 'pointer' }}>
                <CardBody className="position-relative d-flex align-items-center py-3">
                    <div className={`position-absolute d-flex justify-content-center align-items-center ${clickMethod != 'card' ? 'ps-1' : ''}`}>
                        {icon}
                    </div>
                    <div className="ms-5 ps-3 text-muted">
                        <h6 >{text}</h6>
                    </div>
                </CardBody>
            </Card>
        )
    }

    if (!selectedPaymentCard) {
        return (
            <>
                <ModalBody className=" overflow-auto">
                    <section className="d-flex flex-column h-100 px-4 justify-content-center">
                        <div className="mb-3">
                            <h4 className="text-muted">Escolha o Método de Pagamento</h4>
                            <p className="text-muted mb-0">Selecione uma das opções abaixo para realizar seu pagamento de forma confiável e segura.</p>
                        </div>
                        <PaymentMethodCards text={'Cartão de Crédito'} icon={<PaymentCardIcon />} clickMethod={'card'} />
                        <PaymentMethodCards text={'Pix (Transferência Instantânea)'} icon={<PaymentPixIcon />} clickMethod={'pix'} />
                        <PaymentMethodCards text={'Boleto Bancário'} icon={<PaymentTicketIcon />} clickMethod={'ticket'} />
                    </section>
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <div className="px-4">
                        <Button variant="secondary d-flex align-items-center btn-sm" onClick={() => {
                            handlePreviousStep();
                            setSteps('address');
                        }}>
                            <ReturnIcon size={'18'} />
                            <span className="ms-2">Voltar</span>
                        </Button>
                    </div>
                </ModalFooter>
            </>
        )
    } else {
        return (
            <CardContent
                userData={userData}
                setShowSaleStepsModal={setShowSaleStepsModal}
                handleNextStep={handleNextStep}
                setSteps={setSteps}
                setShowProgressBar={setShowProgressBar}
                showProgressBar={showProgressBar}
                setOptionsSelected={setOptionsSelected}
                optionsSelected={optionsSelected}
                setSelectedPaymentCard={setSelectedPaymentCard}
            />
        )
    }

}


export default SelectedPaymentContent