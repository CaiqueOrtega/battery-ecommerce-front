import { ModalBody, ModalFooter, Accordion, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { PaymentPixIcon, PaymentTicketIcon, GeoFenceIcon, BatteryIcon, ReturnIcon, CardsMultiColorIcon, ErrorCircleFillIcon } from "../../../../assets/icons/IconsSet";
import SaleServices from "../../../../services/sale/SaleServices";
import getCardDetails from "../../../../components/common/getCardDetails";
import { useState, useMemo, useEffect } from "react";
import { ErrorAnimation, SuccessAnimation } from "../../../../components/common/ErrorOrSuccessAnimation";
import BatteryCartServices from "../../../../services/cart/BatteryCartServices";
import RenderPixContent from "../selectedPaymentMethod/methods/PixContent"
import TicketContent from "../selectedPaymentMethod/methods/TicketContent";
import { Link } from "react-router-dom";
import ToastComponent from "../../../../components/common/ToastComponent";

function ConfirmStepsContent({ optionsSelected, batteryCart, freightValues, setBatteryCart, setShowProgressBar, setSteps, handlePreviousStep, setSuccessSale }) {
    const { getByUser } = BatteryCartServices();
    const { createCreditCardPayment, createPixPayment, createTicketPayment, setErrorMessages, errorMessages, } = SaleServices();
    const [stepsConfirmPayment, setStepsConfirmPayment] = useState('confirm_data');
    const [resultPayment, setResultPayment] = useState({});
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const RenderSaleSuccessCard = ({ resultPayment }) => (
        <>
            <div className="position-absolute d-flex flex-column w-100 align-items-center border-bottom py-3 " style={{ backgroundColor: '#fcfcfc' }} >
                <SuccessAnimation />
                <h5 className='mt-2 ' style={{ color: '#58af9b' }}>Seu pedido foi realizado com sucesso</h5>
            </div>
            <ModalBody>
                <section className="px-4 h-100 d-flex flex-column justify-content-center align-items-center">

                    <Card className="mt-4 w-100">
                        <Card.Header>
                            <Card.Text className='text-muted'>
                                Pedido: <span className='fw-bold' style={{ color: '#58af9b' }}>#{resultPayment.saleCode} </span>
                                - Status Pago
                            </Card.Text>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={1} className="col-auto d-flex align-items-center">
                                    <div className="position-absolute">
                                        <CardsMultiColorIcon />
                                    </div>
                                </Col>
                                <Col className="d-flex flex-column justify-content-center ms-4 lh-sm">
                                    <span>Veja Mais detalhes do pagamento</span>
                                    <span className="text-muted">como comprovante valore e etc...</span>

                                </Col>
                                <Col className="col-auto"><Button variant="green" onClick={() => window.open(resultPayment.registros[0].fmc_link_compartilhamento, '_blank', 'noopener noreferrer')}
                                >Ver mais</Button></Col>

                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4">
                        <Card.Body>
                            <span className="text-muted">
                                Sua compra foi concluída com sucesso. Agora, você pode verificar todos os detalhes do seu <Link className="text-muted" to={'/configuracoes/pedidos'}>
                                    pedido</Link>.
                            </span>
                        </Card.Body>
                    </Card>
                </section>
            </ModalBody>
        </>
    );

    const handleCreateSale = async (method) => {
        setIsLoadingPayment(true)
        const confirmedPaymentOption = {
            'card': async () => {
                return await createCreditCardPayment({
                    cardId: optionsSelected.payment.data.cardId,
                    cep: optionsSelected.address.cep,
                    addressId: optionsSelected.address.addressId,
                    userId: optionsSelected.userId,
                    cartId: batteryCart.cartId
                });
            },
            'pix': async () => {
                return await createPixPayment({
                    cep: optionsSelected.address.cep,
                    addressId: optionsSelected.address.addressId,
                    userId: optionsSelected.userId,
                    cartId: batteryCart.cartId
                });
            },
            'ticket': async () => {
                return await createTicketPayment({
                    cep: optionsSelected.address.cep,
                    addressId: optionsSelected.address.addressId,
                    userId: optionsSelected.userId,
                    cartId: batteryCart.cartId
                });
            }
        };
        if (confirmedPaymentOption[method]) {
            const response = await confirmedPaymentOption[method]();
            if (response) {
                const newCart = await getByUser(optionsSelected.userId)
                setBatteryCart(newCart);
                setResultPayment(response)
                setStepsConfirmPayment(`create_sale_${method}`)
                setShowProgressBar(false);
                setSuccessSale(true);
            } else {
                setErrorMessages({ general: 'Ocorreu um erro ao realizar a compra, tente novamente mais tarde' })
                setShowToast(true);
            }
        }
    }


    const confirmStep = useMemo(() => {
        switch (stepsConfirmPayment) {
            case 'confirm_data':
                return <ConfirmOptions
                    optionsSelected={optionsSelected}
                    batteryCart={batteryCart}
                    freightValues={freightValues}
                    handleCreateSale={handleCreateSale}
                    setSteps={setSteps}
                    handlePreviousStep={handlePreviousStep}
                    isLoadingPayment={isLoadingPayment}
                />;
            case 'create_sale_card':
                return <RenderSaleSuccessCard resultPayment={resultPayment} />
            case 'create_sale_pix':
                return <RenderPixContent resultPayment={resultPayment} />
            case 'create_sale_ticket':
                return <TicketContent resultPayment={resultPayment} />
            default:
                return null;
        }
    }, [stepsConfirmPayment, isLoadingPayment]);

    return (
        <>
            {confirmStep}
            <div className='position-fixed top-0 end-0 mt-2 me-4' style={{ zIndex: 1350 }}>
                <ToastComponent
                    icon={<ErrorCircleFillIcon />}
                    message={errorMessages.general}
                    showToast={showToast}
                    setShowToast={setShowToast}
                />
            </div>
        </>
    )

}



function ConfirmOptions({ batteryCart, optionsSelected, freightValues, handleCreateSale, setSteps, handlePreviousStep, isLoadingPayment }) {

    const RenderCardPayment = ({ text, subText, icon }) => {
        return (
            <Card >
                <Card.Body className="">
                    <Row>
                        <Col className="col-auto px-4 position-relative d-flex justify-content-center align-items-center">
                            <div className="position-absolute">
                                {icon}
                            </div>
                        </Col>
                        <Col className="d-flex flex-column justify-content-center">
                            <h6 className="mb-0">{text}</h6>
                            <span className="text-muted small">{subText}</span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        )
    }

    const paymentMethod = (selectedMethod) => {
        switch (selectedMethod) {
            case 'card':
                const { icon } = getCardDetails(optionsSelected?.payment.data?.flag, true, '#1c39cb');
                return <RenderCardPayment
                    text={`Cartão de crédito ${optionsSelected?.payment.data?.flag}`}
                    subText={`Terminado em ••••${optionsSelected?.payment.data?.partialCard}`}
                    icon={icon} />
            case 'pix':
                return <RenderCardPayment
                    text={'Pagamento via Pix'}
                    subText={'Transferência instantânea, rápida e segura'}
                    icon={<PaymentPixIcon />} />
            case 'ticket':
                return <RenderCardPayment
                    text={'Pagamento via Boleto Bancário'}
                    subText={'Pague até a data de vencimento(3 dias)'}
                    icon={<PaymentTicketIcon />} />
            default:
                return null;

        }
    }
    return (
        <>
            <ModalBody >
                <section className="px-4 d-flex flex-column justify-content-center h-100">
                    <div className="mb-3">
                        <h5 className="mb-0 fw-bold text-muted">Revisar dados do Pedido</h5>
                        <span className="text-muted">Por favor, revise atentamente seu pedido para garantir que todas as informações estão corretas</span>
                    </div>

                    <div>
                        {paymentMethod(optionsSelected?.payment?.method)}
                    </div>

                    <div className="mt-2">
                        <RenderCardPayment
                            text={`${optionsSelected?.address?.address}, ${optionsSelected?.address?.number}`}
                            subText={`${optionsSelected?.address?.city}-${optionsSelected?.address?.state}, ${optionsSelected?.address?.cep}`}
                            icon={<GeoFenceIcon size={'56px'} />} />
                    </div>

                    <Accordion defaultActiveKey="0" flush className="border rounded-2 mt-2">
                        <Accordion.Item eventKey="0" className="rounded-2 p-0">
                            <Accordion.Button className="d-flex justify-content-between py-3 px-3 rounded-2">
                                <div className="">
                                    <BatteryIcon />
                                    <span className="ms-3 text-muted">
                                        Resumo de Valores ({batteryCart?.batteries?.length})
                                    </span>
                                </div>
                            </Accordion.Button>
                            <Accordion.Body className="px-3 py-2 overflow-auto custom-scrollbar" style={{ MaxHeight: 175 }}>
                                <hr className="opacity-25 mt-0" />
                                <div className="p-0 overflow-auto custom-scrollbar" style={{ MaxHeight: 175 }}>
                                    <div className="d-flex text-muted justify-content-between small">
                                        <span>Subtotal</span>
                                        <span className="ms-2">R$ {batteryCart?.totalValue}</span>
                                    </div>

                                    <div className="d-flex text-muted justify-content-between mt-1 small">
                                        <span>Frete</span>
                                        <span className="ms-2">R$ {freightValues?.totalFreightCost?.toFixed(2)?.replace('.', (','))}</span>
                                    </div>


                                    <div className="d-flex text-muted justify-content-between fw-bold mt-1 small">
                                        <span>Total</span>
                                        <span className="ms-2">R$
                                            {(((batteryCart?.discountedValue) ?? (batteryCart?.totalValue)) + (freightValues?.totalFreightCost || 0))
                                                ?.toFixed(2)
                                                ?.replace('.', ',')}
                                        </span>

                                    </div>
                                </div>

                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </section>
            </ModalBody>
            <ModalFooter>
                <div className="px-4 d-flex justify-content-between flex-grow-1">
                    <Button variant="secondary d-flex align-items-center" onClick={() => {
                        handlePreviousStep();
                        setSteps('payment');
                    }}>
                        <ReturnIcon size={'17'} /><span className="ms-2 small">Voltar</span>
                    </Button>
                    <Button variant="yellow"
                        disabled={isLoadingPayment}
                        onClick={() => handleCreateSale(optionsSelected.payment.method)}>
                        Finalizar Compra
                        {isLoadingPayment && (
                            <Spinner className="ms-2" animation="border" role="status" style={{ width: 15, height: 15 }}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        )}
                    </Button>
                </div>
            </ModalFooter>
        </>
    )
}



export default ConfirmStepsContent;