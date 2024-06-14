import { useState, useEffect, useRef } from "react";
import { AddCardIcon, ReturnIcon, CardChipIcon, VisaIcon, MasterCardIcon, AmericanExpressIcon, EloIcon, DiscoverIcon, JcbIcon, DinersClubIcon, HipercardIcon, AuraCardIcon } from "../../../assets/icons/IconsSet";
import { Card, Form, Row, Col, Button} from "react-bootstrap";
import CardServices from "../../../services/card/CardServices";
import FormValidations from "../../../components/common/FormValidation";
import ConfirmChangesModal from "../../../components/common/ConfirmChangesModal";
import { useGlobalDataProvider } from "../../../context/GlobalDataProvider";
import FormGroupWithIcon from "../../../components/common/FormGroupWithIcon";
import './card.css'
import AlertErrorOrSuccess from "../../../components/common/AlertErrorOrSuccess";

function CardContent() {
    const [confirmAction, setConfirmAction] = useState(null);
    const { card, setCard, fetchCard, cardIsLoaded, userData } = useGlobalDataProvider();
    const { isEquals } = FormValidations();
    const { createCard, updateCard, deleteCard, updateMainCard, setErrorMessages, errorMessages } = CardServices();

    const [showCardForm, setShowCardForm] = useState(false);
    const [confirmChangesModalData, setConfirmChangesModalData] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [prevFormCardValues, setPrevFormCardValues] = useState({});
    const [selectedFormCardValues, setSelectedFormCardValues] = useState({});
    const [formCardValues, setFormCardValues] = useState({
        cardNumber: '',
        cardOwner: '',
        expirationDate: '',
        main: false,
        cvv: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            await fetchCard();
        };
        if (Object.keys(card).length === 0) {
            fetchData();
        }
    }, []);

    useEffect(() => {
        if (showCardForm) {
            setErrorMessages({});
            const maskCardNumber = (partialCard) => {
                const visibleSection = partialCard.slice(-4);
                const maskedSection = '•'.repeat(selectedFormCardValues.length - 4);
                const spacedVisibleSection = visibleSection.replace(/(.{4})/g, '$1 ');
                return `${maskedSection}${spacedVisibleSection}`.trim();
            };

            var newCardNumber = maskCardNumber(selectedFormCardValues.partialCard || '');

            setFormCardValues({
                cardNumber: newCardNumber,
                cardOwner: selectedFormCardValues.cardOwner || '',
                expirationDate: selectedFormCardValues.expirationDate || '',
                main: selectedFormCardValues.main || false,
                cvv: selectedFormCardValues.cvv || ''
            })
        }
        if (selectedFormCardValues) {
            const { cardId, length, partialCard, flag, ...rest } = selectedFormCardValues;
            setPrevFormCardValues({ cardNumber: newCardNumber, ...rest });
        }

    }, [showCardForm])


    const handleConfirmChangesModal = async () => {
        const getUpdateCardData = async () => {
            if (confirmAction.action === 'update') {
                const response = await updateCard(confirmAction.data.cardId, confirmAction.data.formCardValues);
                if (response) {
                    setShowCardForm(false);
                    return card.map(c => (c.cardId === response.cardId ? response : c));
                }
            } else if (confirmAction.action === 'delete') {
                const response = await deleteCard(confirmAction.data.cardId);
                if (response) {
                    return card.filter(c => c.cardId !== confirmAction.data.cardId);
                }
            }
            return undefined;
        };

        const updatedCardData = await getUpdateCardData();

        if (updatedCardData !== undefined) {
            setCard(updatedCardData);
        } else {
            setPrevFormCardValues(confirmAction.data.formCardValues);
        }
    };


    const handleCardAction = async (e, action, data) => {
        e.preventDefault();

        const actions = {
            'create': async () => {
                if (card?.length === 0) {
                    data.formCardValues.main = true;
                }

                const response = await createCard(data.formCardValues, userData.userId);
                if (response) {
                    const updatedCardValues = data.formCardValues.main
                        ? [...card.map(card => ({ ...card, main: false })), response]
                        : [...card, response];

                    setCard(updatedCardValues);
                    setShowCardForm(false);
                }
            },
            'update': async () => {
                setShowConfirmChangesModal(true);
                setConfirmChangesModalData({ title: 'Editar Cartão', message: 'Deseja realmente editar o Cartão?' });
                setConfirmAction({ action, data });
                setPrevFormCardValues({});
            },
            'delete': async () => {
                setShowConfirmChangesModal(true);
                setConfirmChangesModalData({ title: 'Deletar Cartão', message: 'Deseja realmente deletar o Cartão?' });
                setConfirmAction({ action, data });
            },
            'update_main': async () => {
                const response = await updateMainCard(data.cardId);
                if (response) {
                    setCard(card.map(card =>
                        ({ ...card, main: card.cardId === data.cardId })
                    ));
                }
            }
        };

        const isValid = action !== 'update_main' && action !== 'delete' ? !isEquals(data.formCardValues, prevFormCardValues, setPrevFormCardValues, setErrorMessages) : true

        if (actions[action] && isValid) {
            await actions[action]();
        }
    };

    function getCardDetails(cardValue, smallSize) {
        let cardDetails = {
            length: 16,
            primaryColor: '#888888',
            secondaryColor: '#818181',
            icon: null,
        };

        if (cardValue.match(/^3[47][0-9]{13}$/) || cardValue === 'American Express') {
            cardDetails = {
                length: 15,
                primaryColor: '#4B9CD3',
                secondaryColor: '#71C5E8',
                icon: <AmericanExpressIcon size={smallSize ? 22 : null} />,
            };
        } else if (cardValue.match(/^4[0-9]{12}(?:[0-9]{3})?$/) || cardValue === 'Visa') {
            cardDetails = {
                length: 16,
                primaryColor: '#1A1F71',
                secondaryColor: '#4F5BA6',
                icon: <VisaIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^5[1-5][0-9]{14}$/) || cardValue === 'MasterCard') {
            cardDetails = {
                length: 16,
                primaryColor: '#EB001B',
                secondaryColor: '#ff9413',
                icon: <MasterCardIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/) || cardValue === 'Discover') {
            cardDetails = {
                length: 16,
                primaryColor: '#86B8CF',
                secondaryColor: '#B0D1E3',
                icon: <DiscoverIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/) || cardValue === 'Elo') {
            cardDetails = {
                length: 16,
                primaryColor: '#00A4E0',
                secondaryColor: '#66C7F4',
                icon: <EloIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^3(?:0[0-5]|[68]).*/) || cardValue === 'Diners Club') {
            cardDetails = {
                length: 14,
                primaryColor: '#0079BE',
                secondaryColor: '#4DA8DA',
                icon: <DinersClubIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^606282|^3841(?:[0|4|6]{1})0/) || cardValue === 'HiperCard') {
            cardDetails = {
                length: 16,
                primaryColor: '#B20838',
                secondaryColor: '#E73561',
                icon: <HipercardIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^(?:2131|1800|35\d{3})\d{11}/) || cardValue === 'JCB') {
            cardDetails = {
                length: 16,
                primaryColor: '#1F5CA7',
                secondaryColor: '#497EC7',
                icon: <JcbIcon size={smallSize ? 35 : null} />,
            };
        } else if (cardValue.match(/^((?!504175))^((?!5067))(^50[0-9])/) || cardValue === 'Aura') {
            cardDetails = {
                length: 16,
                primaryColor: '#ffff00',
                secondaryColor: '#fec117',
                icon: <AuraCardIcon size={smallSize ? 35 : null} />,
            };
        }

        return cardDetails;
    }


    return (
        <>
            <div className="d-flex justify-content-between align-items-center px-5 py-3 bg-yellow text-white fw-bold" style={{ maxHeight: 60 }}>

                {showCardForm ? (
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <a type="button" onClick={() => setShowCardForm(false)}><ReturnIcon /> Voltar</a>
                        <h4 className="mb-0">Controle de Cartões</h4>
                    </div>
                ) : (
                    <>
                        <h4 className="mb-0">Meus Cartões</h4>
                        <a type="button" className="text-decoration-none text-white"
                            onClick={() => { setShowCardForm(true); setSelectedFormCardValues({}) }}
                        >
                            <AddCardIcon />
                            <span className="ms-2">Adicionar novo Cartão</span>
                        </a>
                    </>
                )}
            </div >

            <div className="h-100 py-5 px-md-5 px-4 d-flex-justify-content-center align-items-center" >
                {showCardForm ? (
                    <>
                        <section className="mb-5">
                            {selectedFormCardValues && Object.keys(selectedFormCardValues).length <= 0 ? (
                                <>
                                    <h4>Cadastro de Cartão</h4>
                                    <p>Cadastre seu cartão de crédito para compras rápidas e seguras. Seus dados são criptografados para garantir total proteção.</p>
                                </>
                            ) : (
                                <>
                                    <h4>Editar dados de Cartão</h4>
                                    <p>Atualize os dados do seu cartão de crédito para compras rápidas e seguras. Seus dados são criptografados para garantir total proteção.</p>
                                </>
                            )}

                        </section>
                        <CardModel
                            formCardValues={formCardValues}
                            setFormCardValues={setFormCardValues}
                            handleCardAction={handleCardAction}
                            selectedFormCardValues={selectedFormCardValues}
                            getCardDetails={getCardDetails}
                            errorMessages={errorMessages}

                        />
                    </>
                ) : (
                    <>
                        <UserCard
                            card={card}
                            userData={userData}
                            setShowCardForm={setShowCardForm}
                            setSelectedFormCardValues={setSelectedFormCardValues}
                            selectedFormCardValues={selectedFormCardValues}
                            getCardDetails={getCardDetails}
                            handleCardAction={handleCardAction}
                        />
                    </>
                )}
            </div>

            <ConfirmChangesModal
                showConfirmChangesModal={showConfirmChangesModal}
                setShowConfirmChangesModal={setShowConfirmChangesModal}
                handleConfirmChanges={handleConfirmChangesModal}
                confirmChangesModalData={confirmChangesModalData}
            />
        </>
    )
}

function UserCard({ card, setShowCardForm, handleCardAction, selectedFormCardValues, setSelectedFormCardValues, getCardDetails }) {
    if (!card || !Array.isArray(card) || card.length === 0) {
        return null;
    }

    const handleOpenFormUpdate = (card, length) => {
        const updatedCard = { ...card, cvv: '***', length: length };
        setSelectedFormCardValues(updatedCard);
        setShowCardForm(true);
    }

    return (
        <section>
            {card.map((card, index) => {
                const cardDetails = getCardDetails(card.flag, true);
                const { primaryColor, secondaryColor } = cardDetails;

                return (
                    <Card key={index} className={`rounded-3  ${index > 0 ? 'mt-4' : ''}`}>
                        <Card.Header className="d-flex justify-content-between align-items-center py-1">
                            <div>
                                <span className="text-muted small">{card.cardOwner.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())}</span>
                            </div>
                            <Form.Label className="d-flex small text-muted align-items-center mb-0">
                                {card.main && 'Cartão Principal'}
                                <Form.Check type={'radio'} className={`ms-2`}
                                    checked={card.main}
                                    readOnly={card.main}
                                    onChange={(e) => !card.main && handleCardAction(e, 'update_main', { cardId: card.cardId })}
                                />
                            </Form.Label>
                        </Card.Header>
                        <Card.Body >
                            <Row>
                                <Col className="col-auto d-flex align-items-center">
                                    <Card className="p-1 border-0 shadow-sm rounded-1" style={{ height: 60, width: 100, backgroundImage: `linear-gradient(-45deg, ${primaryColor} 55%, ${secondaryColor} 50%)`, backgroundSize: '200% 100%' }}>
                                        <div className="position-relative d-flex w-100 justify-content-between align-items-center">
                                            <CardChipIcon className={"size-mini-credit-chip"} />

                                            <div className="position-absolute end-0">
                                                {cardDetails.icon}
                                            </div>
                                        </div>

                                        <div className="text-white mt-auto fw-bold" style={{ fontSize: 7.3 }}>
                                            {card.cardOwner}
                                        </div>

                                    </Card>
                                </Col>
                                <Col className=" col-auto">
                                    <h5 className="mb-1" style={{ fontSize: 17 }}>
                                        Cartão {card.flag}
                                    </h5>
                                    <p className="text-muted">
                                        cartão terminado em •••• {card.partialCard}
                                    </p>
                                </Col>

                                <Col className="d-flex align-items-end flex-column">
                                    <a type="button" className="text-muted" onClick={() => handleOpenFormUpdate(card, cardDetails.length)}>Editar</a>
                                    <a type="button" className="text-muted"
                                        onClick={(e) => handleCardAction(e, 'delete', { cardId: card.cardId })}>Excluir</a>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                );
            })}
        </section>
    );
}


function CardModel({ formCardValues, setFormCardValues, handleCardAction, selectedFormCardValues, getCardDetails, errorMessages }) {
    const [focusedField, setFocusedField] = useState(null);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [colorCard, setColorCard] = useState({ primary: '', secondary: '' });
    const [prevColorCard, setPrevColorCard] = useState({ primary: '#888888', secondary: '#818181' });
    const [isAnimating, setIsAnimating] = useState(false);
    const [cardIcon, setCardIcon] = useState(null);
    const nextColorCardRef = useRef(null);
    const [debounceTimer, setDebounceTimer] = useState(null);
    const formRef = useRef();

    useEffect(() => {
        if (colorCard.primary !== '' && colorCard.secondary !== '') {

            if (colorCard?.primary === prevColorCard?.primary && colorCard?.secondary === prevColorCard?.secondary) return;

            setPrevColorCard(colorCard);
            if (!isAnimating) {
                startAnimation(colorCard);
            } else {
                nextColorCardRef.current = colorCard;
            }
        }
    }, [colorCard]);

    const startNextAnimation = () => {
        const nextColorCard = nextColorCardRef.current;
        nextColorCardRef.current = null;
        startAnimation(nextColorCard);
    };

    const startAnimation = (colorCard) => {
        setIsAnimating(true);
        const cardElements = document.querySelectorAll('.credit-card');

        if (cardElements) {
            cardElements.forEach(cardElement => {
                cardElement.style.setProperty('--new-color-card-primary', colorCard.primary);
                cardElement.style.setProperty('--new-color-card-secondary', colorCard.secondary);

                cardElement.classList.remove('credit-card-animation');
                void cardElement.offsetWidth;
                cardElement.classList.add('credit-card-animation');

                const onAnimationEnd = () => {
                    cardElement.style.setProperty('--color-card-primary', colorCard.primary);
                    cardElement.style.setProperty('--color-card-secondary', colorCard.secondary);
                    setIsAnimating(false);

                    if (nextColorCardRef.current) {
                        startNextAnimation();
                    }

                };
                cardElement.addEventListener('animationend', onAnimationEnd);
            });

        }
    };


    useEffect(() => {
        const handleCardNumberChange = () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }

            const newTimer = setTimeout(() => {
                let newValue = selectedFormCardValues?.flag ? selectedFormCardValues?.flag : formCardValues.cardNumber;

                const cardDetails = getCardDetails(newValue, false);

                setColorCard({ primary: cardDetails.primaryColor, secondary: cardDetails.secondaryColor });
                setCardIcon(cardDetails.icon);

            }, 500);

            setDebounceTimer(newTimer);
        };

        if (formCardValues?.cardNumber !== '' && formCardValues?.cardNumber !== null && formCardValues?.cardNumber !== undefined) {
            handleCardNumberChange();
        }
    }, [formCardValues?.cardNumber])



    const formatCardNumberForDisplay = (cardNumber) => {
        let newValue = selectedFormCardValues?.flag ? selectedFormCardValues?.flag : cardNumber
        const { length } = getCardDetails(newValue)

        console.log(length)
        const paddedNumber = cardNumber.padEnd(length, '●');
        const chunks = paddedNumber.match(/.{1,4}/g);
        return chunks.join(' ');
    };

    const handleFocus = (field) => {
        console.log('testeeeeeeeeeee')
        setFocusedField(field);
        if (field === 'cvv') {
            setIsCardFlipped(true);
        }
    };

    const handleBlur = () => {
        setFocusedField('');
        setIsCardFlipped(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formRef.current.reportValidity()) {

            if (selectedFormCardValues?.partialCard) {
                handleCardAction(e, 'update', { cardId: selectedFormCardValues.cardId, formCardValues: formCardValues })
            } else {
                handleCardAction(e, 'create', { formCardValues: formCardValues })
            }
        }
    }

    return (
        <>
            <Row >
                <Col>
                    <CardForm
                        formCardValues={formCardValues}
                        setFormCardValues={setFormCardValues}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        selectedFormCardValues={selectedFormCardValues}
                        formRef={formRef}
                        errorMessages={errorMessages}
                    />
                </Col>

                <Col className="order-md-0 order-first">
                    <div className={`credit-card-container ${isCardFlipped ? 'flipped' : ''}`}>
                        <Card className=" credit-card credit-card-front p-4 border-0 shadow rounded-3">
                            <div className="position-relative d-flex w-100 justify-content-between align-items-center">
                                <CardChipIcon className={"size-credit-chip"} />

                                <div className="position-absolute end-0">
                                    {cardIcon}
                                </div>
                            </div>
                            <div className="text-white mt-3">
                                <p className="m-0" style={{
                                    fontWeight: focusedField === 'cardNumber' ? 'bold' : 'normal',
                                    textShadow: focusedField === 'cardNumber' ? '0px 0px 5px rgba(0,0,0,0.5)' : 'none'
                                }}>
                                    {formatCardNumberForDisplay(formCardValues.cardNumber)}
                                </p>

                                <Row className="d-flex justify-content-between h-100">
                                    <Col className="align-self-end">
                                        <p className="m-0" style={{
                                            fontWeight: focusedField === 'cardOwner' ? 'bold' : 'normal',
                                            textShadow: focusedField === 'cardOwner' ? '0px 0px 5px rgba(0,0,0,0.5)' : 'none'
                                        }}>
                                            {formCardValues.cardOwner || 'NOME DO CARTÃO'}
                                        </p>
                                    </Col>

                                    <Col className="text-center validate col-auto align-self-end">
                                        <span>Validade</span>
                                        <p className="m-0" style={{
                                            fontWeight: focusedField === 'expirationDate' ? 'bold' : 'normal',
                                            textShadow: focusedField === 'expirationDate' ? '0px 0px 5px rgba(0,0,0,0.5)' : 'none'
                                        }}>
                                            {formCardValues.expirationDate || '12/23'}
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        </Card>

                        <Card className="border-0 shadow credit-card credit-card-back rounded-3">
                            <div className="w-100 py-4 mt-4 mb-3" style={{ backgroundColor: '#262626' }}> </div>

                            <div className="ms-3 position-relative " style={{ width: '240px' }}>
                                <svg width="240" height="38" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0" y="0" width="240" height="38" fill="#FFFFFF" />
                                    <rect x="0" y="5" width="240" height="1" fill="rgba(255, 165, 0, 0.3)" />
                                    <rect x="0" y="15" width="240" height="1" fill="rgba(255, 165, 0, 0.3)" />
                                    <rect x="0" y="25" width="240" height="1" fill="rgba(255, 165, 0, 0.3)" />
                                    <rect x="0" y="35" width="240" height="1" fill="rgba(255, 165, 0, 0.3)" />
                                </svg>
                                <p className="m-0 position-absolute end-0 me-2 top-50 translate-middle-y" style={{
                                    fontFamily: 'monospace', fontSize: '16px',
                                    fontWeight: focusedField === 'cvv' ? 'bold' : 'normal',
                                }}>{formCardValues.cvv || '***'}</p>
                            </div>
                        </Card>
                    </div>
                </Col>

                <Col xs={12} className="d-flex justify-content-between">
                    <div className="d-flex align-items-end flex-grow-1">
                        <AlertErrorOrSuccess errorMessages={errorMessages} />
                    </div>

                    <div className="d-flex justify-content-end mt-5 flex-grow-1">
                        <Button variant="yellow"
                            onClick={handleSubmit}>{selectedFormCardValues?.partialCard ? 'Editar' : 'Cadastrar'} Cartão</Button>
                    </div>

                </Col>
            </Row>
        </>
    );

}

function CardForm({ formCardValues, setFormCardValues, handleFocus, handleBlur, selectedFormCardValues, formRef, errorMessages, handleSubmit }) {

    return (
        <>
            <Form ref={formRef} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label className="w-100" >Número do Cartão
                        <FormGroupWithIcon
                            type={"text"}
                            value={formCardValues.cardNumber}
                            onChange={(e) => setFormCardValues({ ...formCardValues, cardNumber: e.target.value })}
                            onFocusData={{ function: handleFocus, param: 'cardNumber' }}
                            onBlurData={{ function: handleBlur }}
                            maxLength={"16"}
                            placeholder={"Número do Cartão"}
                            required={true}
                            disable={selectedFormCardValues?.partialCard ? true : false}
                            feedback={errorMessages.cardNumber}
                        />
                    </Form.Label>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="w-100" >Nome no Cartão
                        <FormGroupWithIcon
                            type={"text"}
                            value={formCardValues.cardOwner}
                            onChange={(e) => setFormCardValues({ ...formCardValues, cardOwner: e.target.value.toUpperCase() })}
                            onFocusData={{ function: handleFocus, param: 'cardOwner' }}
                            onBlurData={{ function: handleBlur }}
                            placeholder={"Nome no Cartão"}
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
                                    onFocusData={{ function: handleFocus, param: 'expirationDate' }}
                                    onBlurData={{ function: handleBlur }}
                                    maxLength={"5"}
                                    placeholder={"MM/AA"}
                                    required={true}
                                    feedback={errorMessages.expirationDate}
                                />
                            </Form.Label>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label className="w-100 z-3"
                                onMouseOver={() => selectedFormCardValues?.cvv && handleFocus('cvv')}
                                onMouseOut={() => selectedFormCardValues?.cvv && handleBlur()}
                            >CVV
                                <FormGroupWithIcon
                                    type={"text"}
                                    value={formCardValues.cvv}
                                    onChange={(e) => setFormCardValues({ ...formCardValues, cvv: e.target.value })}
                                    onFocusData={{ function: handleFocus, param: 'cvv' }}
                                    onBlurData={{ function: handleBlur }}
                                    maxLength={"4"}
                                    placeholder={"CVV"}
                                    required={true}
                                    disable={selectedFormCardValues?.cvv ? true : false}
                                    feedback={errorMessages.cvv}
                                />
                            </Form.Label>
                        </Form.Group>
                    </Col>
                </Row>

                {!selectedFormCardValues?.partialCard ? (
                    <Col className="col-md-12">
                        <Form.Check
                            label={'Cartão principal'}
                            checked={formCardValues.main}
                            onChange={(e) => setFormCardValues({ ...formCardValues, main: e.target.checked })}
                        />
                    </Col>
                ) : null}
            </Form >
        </>
    )
}

export default CardContent;