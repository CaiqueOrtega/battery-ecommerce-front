import { Modal, Card, Row, Col, Dropdown, Button, ModalFooter, Form, ModalBody } from "react-bootstrap";
import { MapIcon, ThreeDotsVerticalIcon, ReturnIcon, AddressMapIcon, CardChipIcon, PaymentCardIcon } from "../../../../../assets/icons/IconsSet";
import { useEffect, useState, useRef } from "react";
import CardServices from "../../../../../services/card/CardServices";
import FormValidations from "../../../../../components/common/FormValidation";
import { useGlobalDataProvider } from "../../../../../context/GlobalDataProvider";
import getCardDetails from "../../../../../components/common/getCardDetails";
import FormGroupWithIcon from "../../../../../components/common/FormGroupWithIcon";
import ToastError from "../../../../../components/ToastError";

function CardContent({ userData, setSteps, showProgressBar, setShowProgressBar, handleNextStep, setOptionsSelected, optionsSelected, setSelectedPaymentCard}) {
    const { card, setCard, cardIsLoaded, fetchCard } = useGlobalDataProvider();
    const [cardStepContent, setCardStepContent] = useState('');
    const [cardValues, setCardValues] = useState({})
    const [prevFormCardValues, setPrevFormCardValues] = useState({});
    const [action, setAction] = useState('')
    const [selectedCard, setSelectedCard] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            await fetchCard();
        }
        if (card?.length != 0) {
            let mainCardData = card.find(card => card.main) || card[0]
            if (mainCardData) {
                setCardValues({ ...mainCardData, selectedCreditCard: true });
                setCardStepContent('renderCard')
            }
        } else {
            if (cardIsLoaded) {
                setCardStepContent('emptyCard')
            } else {
                fetchData();
            }
        }
    }, [cardIsLoaded])


    const handleSelectedCard = (currentCard) => {
        setOptionsSelected({ ...optionsSelected, payment: { method: 'card', data: currentCard } })
        setSteps('confirm');
        handleNextStep();
    }


    const showContent = () => {
        console.log(cardStepContent)
        switch (cardStepContent) {
            case 'emptyCard':
                return <RenderEmptyCardContent
                    showProgressBar={showProgressBar}
                    setShowProgressBar={setShowProgressBar}
                    setAction={setAction}
                    setCardStepContent={setCardStepContent}
                />
            case 'formCard':
                return <RenderCardStepFormContent
                    selectedCard={selectedCard}
                    card={card}
                    setCard={setCard}
                    cardValues={cardValues}
                    setCardValues={setCardValues}
                    setCardStepContent={setCardStepContent}
                    action={action}
                    prevFormCardValues={prevFormCardValues}
                    setPrevFormCardValues={setPrevFormCardValues}
                    userId={userData?.userId}
                    handleSelectedCard={handleSelectedCard}
                />
            case 'renderCard':
                return <RenderSelectionCardContent
                    card={card}
                    setCard={setCard}
                    cardValues={cardValues}
                    setCardValues={setCardValues}
                    setAction={setAction}
                    setSelectedCard={setSelectedCard}
                    setPrevFormCardValues={setPrevFormCardValues}
                    setCardStepContent={setCardStepContent}
                    handleSelectedCard={handleSelectedCard}
                    setSelectedPaymentCard={setSelectedPaymentCard}
                />
            default:
                return <ModalBody className="d-flex justify-content-center align-items-center" style={{ height: '578px' }}>
                    <span className="loader"></span>
                </ModalBody>

        }
    };

    return (
        <>
            {cardIsLoaded ? (
                showContent()
            ) : (
                <ModalBody className="d-flex justify-content-center align-items-center" style={{ height: '578px' }}>
                    <span className="loader"></span>
                </ModalBody>
            )}
        </>
    );
}

function RenderEmptyCardContent({ setShowProgressBar, showProgressBar, setAction, setCardStepContent }) {
    if (showProgressBar) {
        setShowProgressBar(false)
    }

    const handleShowFormCreateCard = () => {
        setAction('create');
        setShowProgressBar(true);
        setCardStepContent('formCard');
    }

    return (
        <ModalBody className="d-flex flex-column align-items-center justify-content-center px-5">
            <div className="text-center my-4">
                <AddressMapIcon />
                <h5 className="mt-3">Selecione um cartão para Continuar </h5>
                <p className="text-muted">Você não possui Cartões cadastrados, cadastre para continuar com sua compra!</p>
            </div>

            <div className="d-flex align-items-center justify-content-center mt-3">
                <Button variant="yellow py-2 px-5 fw-bold" onClick={() => handleShowFormCreateCard()}>Cadastrar Cartão</Button>
            </div>
        </ModalBody>
    )
}

function RenderSelectionCardContent({ card, cardValues, setCardValues, setSelectedCard, setAction, setPrevFormCardValues, setCardStepContent, handleSelectedCard, setSelectedPaymentCard }) {

    const handleShowFormUpdate = (currentCard) => {
        setAction('update');
        setSelectedCard(currentCard);
        const { selectedCard, cardId, ...cardWithoutSelected } = currentCard;
        setPrevFormCardValues(cardWithoutSelected);
        setCardStepContent('formCard');
    }

    const handleShowFormCreate = () => {
        setCardStepContent('formCard');
        setAction('create');
    }
    const handleClickCard = (currentCard) => {
        setCardValues({ ...cardValues, isLoading: true })

        setTimeout(() => {
            setCardValues({ ...currentCard, selectedCreditCard: true, isLoading: false })
        }, 500);
    }

    return (
        <>
            <Modal.Body className="overflow-auto">
                <section className="d-flex flex-column h-100 justify-content-center px-4">
                    <div>
                        <h4 className="text-muted">Confirmar cartão Selecionado</h4>
                        <p className="text-muted mb-2">Atualize o cartão de entrega para receber seus produtos no local desejado.</p>
                    </div>
                    <RenderCard
                        currentCard={cardValues}
                        handleShowFormUpdate={handleShowFormUpdate}
                        handleClickCard={handleClickCard}
                    />
                    <hr className="mb-4 mt-4" />
                    <div>
                        <span className='text-muted fw-bold'>Ou Escolha um cartão cadastrado</span>
                        {card.map((card, index) => {
                            return card.cardId !== cardValues?.cardId ? (
                                <RenderCard
                                    key={index}
                                    currentCard={card}
                                    handleClickCard={handleClickCard}
                                    handleShowFormUpdate={handleShowFormUpdate}
                                />
                            ) : null;
                        })}
                    </div>

                    {card?.length <= 2 && (
                        <Card className="shadow-sm card-modal-select-address shadow-sm d-flex flex-row mt-2">
                            <Card.Body className="py-3">
                                <Row>
                                    <Col className='col-auto d-flex align-items-center position-relative'>
                                        <div className="color-red">
                                            <PaymentCardIcon size={'66px'} />
                                        </div>
                                    </Col>
                                    <Col className="d-flex align-items-center">
                                        <span className="text-muted mb-0">Cadastre um novo cartão para mais opções de pagamento.
                                            <a type="button" className="ms-1 text-muted small" onClick={() => { setSelectedCard({}); handleShowFormCreate() }}>Cadastrar Cartão</a>
                                        </span>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </section>
            </Modal.Body >

            <ModalFooter className="d-block">
                <div className=" px-4 d-flex justify-content-between">
                    <Button variant="secondary d-flex align-items-center" onClick={() => setSelectedPaymentCard(false)}>
                        <ReturnIcon size={'17'} /><span className="ms-2 small">Voltar</span>
                    </Button>


                    <Button variant={`yellow px-3 btn-sm`} onClick={() => handleSelectedCard(cardValues)}>Continuar</Button>
                </div>
            </ModalFooter>
        </>
    )
}

function RenderCardStepFormContent({ selectedCard, card, setCard, cardValues, setCardValues, setCardStepContent, userId, action, prevFormCardValues, setPrevFormCardValues, handleSelectedCard }) {
    const { createCard, updateCard, errorMessages, setErrorMessages } = CardServices();
    const [showToastError, setShowToastError] = useState(false);
    const formRef = useRef()
    const { isEquals } = FormValidations();


    const [formCardValues, setFormCardValues] = useState(
        {
            cardNumber: selectedCard?.partialCard || '',
            cardOwner: selectedCard?.cardOwner || '',
            expirationDate: selectedCard.expirationDate || '',
            main: selectedCard?.main || false,
            ownerDocument: selectedCard.ownerDocument || '',
            cvv: selectedCard?.cardId ? '***' : ''
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;
        if (formRef.current.reportValidity() && !isEquals(formCardValues, prevFormCardValues, setPrevFormCardValues, setErrorMessages)) {
            if (action === 'create') {
                response = await createCard(formCardValues, userId);
                if (response) {
                    const updatedCardValues = formCardValues.main
                        ? [...card.map(card => ({ ...card, main: false })), response]
                        : [...card, response];


                    setCard(updatedCardValues);
                    setCardValues(response);
                    handleSelectedCard(response);
                }
            } else if (action === 'update') {
                response = await updateCard(selectedCard?.cardId, formCardValues)
                if (response) {
                    setCard(card.map(c => (c.cardId === response.cardId ? response : c)))
                    if (selectedCard?.cardId === cardValues?.cardId) {
                        console.log('entrou')
                        setCardValues(response)
                    }
                    setCardStepContent('renderCard');
                }
            }
        }
    }

    return (
        <>
            <ModalBody className="p-0 overflow-auto">
                <section className="d-flex flex-column h-100 justify-content-center px-5">
                    {action === 'create' ? (
                        <div className="mb-2">
                            <h5 className="">Adicione um Cartão para Continuar</h5>
                            <p className="text-muted mb-4">
                                {card?.length <= 0 ? (
                                    <>
                                        Você não possui um cartão cadastrado. Adicione um para prosseguir com sua compra!
                                    </>
                                ) : (
                                    <>
                                        Cadastre um novo cartão para continuar com sua compra e realizar o pagamento de forma segura!
                                    </>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="mb-2">
                            <h4 className="text-muted">Editar Cartão Selecionado</h4>
                            <p className="text-muted mb-4">Atualize as informações do seu cartão para garantir que seus pagamentos sejam processados de forma segura e eficiente.</p>
                        </div>
                    )}
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label className="w-100" >Número do Cartão
                                <FormGroupWithIcon
                                    type={"text"}
                                    value={formCardValues.cardNumber}
                                    onChange={(e) => setFormCardValues({ ...formCardValues, cardNumber: e.target.value })}
                                    maxLength={"16"}
                                    placeholder={"Número do Cartão"}
                                    required={true}
                                    disable={selectedCard?.partialCard ? true : false}
                                    feedback={errorMessages.cardNumber}
                                />
                            </Form.Label>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label className="w-100" >Nome Titular
                                <FormGroupWithIcon
                                    type={"text"}
                                    value={formCardValues.cardOwner}
                                    onChange={(e) => setFormCardValues({ ...formCardValues, cardOwner: e.target.value.toUpperCase() })}
                                    placeholder={"Nome Titular"}
                                    required={true}
                                    feedback={errorMessages.cardOwner}
                                />
                            </Form.Label>
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label className="w-100">Data de Validade
                                        <FormGroupWithIcon
                                            type={"text"}
                                            value={formCardValues.expirationDate}
                                            onChange={(e) => setFormCardValues({ ...formCardValues, expirationDate: e.target.value })}
                                            maxLength={"5"}
                                            placeholder={"MM/AA"}
                                            required={true}
                                            feedback={errorMessages.expirationDate}
                                            mask={'99/99'}
                                        />
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label className="w-100 z-3">CVV
                                        <FormGroupWithIcon
                                            type={"text"}
                                            value={formCardValues.cvv}
                                            onChange={(e) => setFormCardValues({ ...formCardValues, cvv: e.target.value })}
                                            maxLength={"4"}
                                            placeholder={"CVV"}
                                            required={true}
                                            disable={selectedCard?.cvv ? true : false}
                                            feedback={errorMessages.cvv}
                                        />
                                    </Form.Label>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label className="w-100">CPF titular
                                <FormGroupWithIcon
                                    type={"text"}
                                    value={formCardValues.ownerDocument}
                                    onChange={(e) => setFormCardValues({ ...formCardValues, ownerDocument: e.target.value })}
                                    maxLength={"14"}
                                    placeholder={"CPF Titular"}
                                    required={true}
                                    feedback={errorMessages.expirationDate}
                                    mask={'999.999.999-99'}
                                />
                            </Form.Label>
                        </Form.Group>
                        {!selectedCard?.partialCard && (
                            <Col className="col-md-12">
                                <Form.Check
                                    className="small"
                                    label={'Cadastrar como cartão principal'}
                                    checked={formCardValues.main}
                                    onChange={(e) => setFormCardValues({ ...formCardValues, main: e.target.checked })}
                                />
                            </Col>
                        )}
                    </Form >
                </section>
            </ModalBody>

            <ModalFooter style={{ justifyContent: 'unset', display: 'unset' }}>
                {
                    (selectedCard?.cardId || action === 'create') && (
                        <>
                            {card?.length > 0 && (
                                <Button variant="secondary d-flex align-items-center float-start " onClick={() => setCardStepContent('renderCard')}>
                                    <ReturnIcon size={'17'} /><span className="ms-2 small">Voltar</span>
                                </Button>
                            )}

                            <Button variant="yellow float-end" type="submit" onClick={(e) => handleSubmit(e)} style={{ maxHeight: '35px' }}>
                                {action === 'update' ? 'Editar' : 'Cadastrar'} Cartão
                            </Button>
                        </>
                    )
                }
            </ModalFooter>

            <ToastError
                showToastError={showToastError}
                setShowToastError={setShowToastError}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
            />
        </>

    )
}

function RenderCard({ currentCard, handleShowFormUpdate, handleClickCard }) {
    const cardDetails = getCardDetails(currentCard?.flag, true);
    const { primaryColor, secondaryColor } = cardDetails;
    const clickable = !currentCard?.selectedCreditCard;


    return (
        <Card className={`rounded-3 position-relative shadow-sm mt-2`}>
            <div className="position-absolute end-0 top-0 z-3">
                <Dropdown className="dropdown-no-caret dropdown-center" style={{ cursor: 'pointer' }} >
                    <Dropdown.Toggle className="text-decoration-none text-muted" as="a">
                        <ThreeDotsVerticalIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-1" style={{ minWidth: 'unset', maxWidth: 'unset', width: '6em' }}>
                        <Dropdown.Item className="small" onClick={() => { handleShowFormUpdate(currentCard) }}>
                            Editar
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Card.Body className="p-3" onClick={clickable ? () => handleClickCard(currentCard) : undefined} style={{ cursor: clickable ? 'pointer' : 'default' }}>
                {!currentCard?.isLoading ? (
                    <Row className="p-0">
                        <Col className="col-auto d-flex align-items-center">
                            <Card
                                className="p-1 border-0 shadow-sm rounded-1"
                                style={{
                                    height: 60,
                                    width: 100,
                                    backgroundImage: `linear-gradient(-45deg, ${primaryColor} 55%, ${secondaryColor} 50%)`,
                                    backgroundSize: '200% 100%',
                                }}
                            >
                                <div className="position-relative d-flex w-100 justify-content-between align-items-center">
                                    <CardChipIcon className={"size-mini-credit-chip"} />
                                    <div className="position-absolute end-0">
                                        {cardDetails?.icon}
                                    </div>
                                </div>
                                <div className="text-white mt-auto fw-bold" style={{ fontSize: 7.3 }}>
                                    {currentCard.cardOwner}
                                </div>
                            </Card>
                        </Col>
                        <Col className="col-auto d-flex flex-column justify-content-center">
                            <h5 className="mb-1" style={{ fontSize: 17 }}>
                                Cartão {currentCard?.flag}
                            </h5>
                            <p className="text-muted mb-0">
                                cartão terminado em •••• {currentCard?.partialCard}
                            </p>
                        </Col>
                    </Row>
                ) : (
                    <div className="d-flex flex-grow-1 align-items-center justify-content-center" style={{ height: 60 }}>
                        <span className="loader"></span>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default CardContent;
