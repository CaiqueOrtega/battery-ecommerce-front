import { useState, useEffect, useRef } from "react";
import { AddCardIcon, ReturnIcon, CardChipIcon, VisaIcon, MasterCardIcon, AmericanExpressIcon, EloIcon, DiscoverIcon, JbcIcon, DinersClub, HipercardIcon, AuraCardIcon } from "../../../assets/icons/IconsSet";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import CardServices from "../../../services/card/CardServices";
import FormValidations from "../../../components/common/FormValidation";
import ConfirmChangesModal from "../../../components/common/ConfirmChangesModal";
import { useGlobalDataProvider } from "../../../context/GlobalDataProvider";
import './card.css'

function CardContent() {
    const [confirmAction, setConfirmAction] = useState(null);
    const { card, setCard, fetchCard, cardIsLoaded, userData } = useGlobalDataProvider();
    const { isEquals } = FormValidations();
    const { createCard, updateCard, deleteCard, setMainCard, setErrorMessages, errorMessages } = CardServices()

    const [showCardForm, setShowCardForm] = useState(false);
    const [confirmChangesModalData, setConfirmChangesModalData] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [prevFormCardValues, setPrevFormCardValues] = useState({});
    const [selectedFormCardValues, setSelectedCardValues] = useState({});
    const [formCardValues, setFormCardValues] = useState({
        cardNumber: '',
        cardOwner: '',
        expirationDate: '',
        cvv: '',
        main: false
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
            setPrevFormCardValues({});
            setFormCardValues({
                cardNumber: selectedFormCardValues.cardNumber || '',
                cardOwner: selectedFormCardValues.cardOwner || '',
                expirationDate: selectedFormCardValues.expirationDate || '',
                cvv: selectedFormCardValues.cvv || '',
                main: selectedFormCardValues.main || false
            })
        }
        if (selectedFormCardValues) {
            const { cardId, ...rest } = selectedFormCardValues;
            setPrevFormCardValues(rest);
        }

    }, [showCardForm])


    const handleCardActionWithConfirmation = (action, data) => {
        if (action === 'update' && isEquals(data.formCardValues, prevFormCardValues, setPrevFormCardValues, setErrorMessages)) {
            return;
        }

        setConfirmChangesModalData({
            title: `${action === 'update' ? 'Editar' : 'Deletar'} Cartão`,
            message: `Deseja realmente ${action === 'update' ? 'editar' : 'deletar'} o Cartão?`
        });
        setConfirmAction({ action, data });
        setShowConfirmChangesModal(true);
        setPrevFormCardValues({});
    };

    const handleConfirmChangesModal = async () => {
        if (confirmAction) {
            const { action, data } = confirmAction;
            await handleCardAction(action, data);
        }
    };

    const handleCardAction = async (action, data) => {
        const actions = {
            'create': async () => {
                if (!isEquals(data.formCardValues, prevFormCardValues, setPrevFormCardValues, setErrorMessages)) {
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
                }
            },
            'update': async () => {
                const response = await updateCard(data.formCardValues, data.cardId);
                if (response) {
                    setCard(card.map(card =>
                        card.cardId === response.cardId ? response : card
                    ));
                    setShowCardForm(false);
                }
            },
            'delete': async () => {
                const response = await deleteCard(data.cardId);
                if (response) {
                    setCard(card.filter(card =>
                        card.cardId !== data.cardId
                    ));
                }
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


        if (actions[action]) {
            await actions[action]();
        }
    };

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
                            onClick={() => { setShowCardForm(true) }}
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
                            <h4>Cadastro de Cartão</h4>
                            <p>Cadastre seu cartão de crédito para compras rápidas e seguras. Seus dados são criptografados para garantir total proteção.</p>
                        </section>
                        <CardModel
                            formCardValues={formCardValues}
                            setFormCardValues={setFormCardValues}
                            handleCardAction={handleCardAction}
                        />
                    </>
                ) : (
                    <>
                        <UserCard card={card} />
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

function UserCard({ card }) {
    if (!card && !Array.isArray(card) && card.length === 0) {
        return null;
    }

    const handleGetFlag = (flag) => {
        const getFlags = {
            'Visa': <VisaIcon />,
            'MasterCard': <MasterCardIcon />,
            'American Express': <AmericanExpressIcon />,
            'Discover': <DiscoverIcon />,
            'Elo': <EloIcon />,
            'JCB': <JbcIcon />,
            'Diners Club': <DinersClub />,
            'Aura': <AuraCardIcon />,
            'HiperCard': <HipercardIcon />
        }

        if (getFlags[flag]) {
            return getFlags[flag];
        }
    }
    return (
        <>
            {card.map((card, index) => (
                <Card key={index} className={`rounded-3 shadow-sm ${index > 0 ? 'mt-4' : ''}`}>
                    <Card.Body className="py-0 position-relative">
                        <div className="d-flex end-0 me-3 position-absolute">
                            <Form.Label className="d-flex small text-muted">
                                {card.main && ('Endereço Principal')}
                                <Form.Check type={'radio'} className={`ms-2`}
                                    checked={card.main}
                                    readOnly={card.main}
                                    onChange={() => !card.main && props.handleAddressAction('update_main', { cardId: card.cardId })}
                                />
                            </Form.Label>
                        </div>
                        <Row >
                            <Col>
                                {handleGetFlag(card.flag)}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}
        </>
    )
}

function CardModel({ formCardValues, setFormCardValues, handleCardAction }) {
    const [focusedField, setFocusedField] = useState(null);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [colorCard, setColorCard] = useState({ primary: '', secondary: '' });
    const [prevColorCard, setPrevColorCard] = useState({ primary: '#888888', secondary: '#818181' });
    const [isAnimating, setIsAnimating] = useState(false);
    const [cardIcon, setCardIcon] = useState(null);
    const nextColorCardRef = useRef(null);

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


    function getCardType(cardNumber) {
        if (cardNumber.match(/^3[47][0-9]{13}$/)) {
            setColorCard({ primary: '#4B9CD3', secondary: '#71C5E8' });
            setCardIcon(<AmericanExpressIcon />)
        } else if (cardNumber.match(/^4[0-9]{12}(?:[0-9]{3})?$/)) {
            setColorCard({ primary: '#1A1F71', secondary: '#4F5BA6' });
            setCardIcon(<VisaIcon />)
        } else if (cardNumber.match(/^5[1-5][0-9]{14}$/)) {
            setColorCard({ primary: '#EB001B', secondary: '#ff9413' });
            setCardIcon(<MasterCardIcon />)
        } else if (cardNumber.match(/^6(?:011|5[0-9]{2})[0-9]{12}$/)) {
            setColorCard({ primary: '#86B8CF', secondary: '#B0D1E3' });
            setCardIcon(<DiscoverIcon />)
        } else if (cardNumber.match(/^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/)) {
            setColorCard({ primary: '#00A4E0', secondary: '#66C7F4' });
            setCardIcon(<EloIcon />);
        } else if (cardNumber.match(/^3(?:0[0-5]|[68]).*/)) {
            setColorCard({ primary: '#0079BE', secondary: '#4DA8DA' });
            setCardIcon(<DinersClub />);
        } else if (cardNumber.match(/^606282|^3841(?:[0|4|6]{1})0/)) {
            setColorCard({ primary: '#B20838', secondary: '#E73561' });
            setCardIcon(<HipercardIcon />);
        } else if (cardNumber.match(/^(?:2131|1800|35\d{3})\d{11}/)) {
            setColorCard({ primary: '#1F5CA7', secondary: '#497EC7' });
            setCardIcon(<JbcIcon />);
        } else if (cardNumber.match(/^((?!504175))^((?!5067))(^50[0-9])/)) {
            setColorCard({ primary: '#ffff00', secondary: '#fec117' })
            setCardIcon(<AuraCardIcon />);
        } else {
            setCardIcon(null)
            setColorCard({ primary: '#888888', secondary: '#818181' });
        }
    }


    useEffect(() => {
        if (formCardValues.cardNumber !== '' || colorCard.primary !== '') {
            getCardType(formCardValues.cardNumber);
        }
    }, [formCardValues.cardNumber]);


    const formatCardNumberForDisplay = (cardNumber) => {
        const paddedNumber = cardNumber.padEnd(16, '●');
        const chunks = paddedNumber.match(/.{1,4}/g);
        return chunks.join(' ');
    };

    const handleFocus = (field) => {
        setFocusedField(field);
        if (field === 'cvv') {
            setIsCardFlipped(true);
        }
    };

    const handleBlur = () => {
        setFocusedField('');
        setIsCardFlipped(false);
    };

    return (
        <>
            <Row >
                <Col>
                    <div className={`credit-card-container ${isCardFlipped ? 'flipped' : ''}`}>
                        <Card className=" credit-card credit-card-front p-4 border-0 shadow rounded-3">
                            <div className="position-relative d-flex w-100 justify-content-between align-items-center">
                                <CardChipIcon className={"size-credit-chip"} />

                                <div className="position-absolute end-0">
                                    {cardIcon}
                                </div>
                            </div>
                            <div className="text-white mt-3">
                                <p className="m-0" style={{ fontWeight: focusedField === 'cardNumber' ? 'bold' : 'normal' }}>
                                    {formatCardNumberForDisplay(formCardValues.cardNumber)}
                                </p>

                                <Row className="d-flex justify-content-between h-100">
                                    <Col className="align-self-end">
                                        <p className="m-0" style={{ fontWeight: focusedField === 'cardOwner' ? 'bold' : 'normal' }}>
                                            {formCardValues.cardOwner || 'NOME DO CARTÃO'}
                                        </p>
                                    </Col>

                                    <Col className="text-center validate col-auto align-self-end">
                                        <span>Validade</span>
                                        <p className="m-0" style={{ fontWeight: focusedField === 'expirationDate' ? 'bold' : 'normal' }}>
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
                                <p className="m-0 position-absolute end-0 me-2 top-50 translate-middle-y" style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold' }}>{formCardValues.cvv || '***'}</p>
                            </div>
                        </Card>
                    </div>
                </Col>

                <Col>

                    <CardForm
                        formCardValues={formCardValues}
                        setFormCardValues={setFormCardValues}
                        handleCardAction={handleCardAction}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                    />

                </Col>
            </Row>
        </>
    );

}

function CardForm({ formCardValues, setFormCardValues, handleCardAction, handleFocus, handleBlur }) {
    const formRef = useRef();


    const handleSubmit = () => {
        if (formRef.current.reportValidity()) {

            handleCardAction('create', { formCardValues: formCardValues })

        }
    }

    return (
        <>

            <Form ref={formRef}>
                <Form.Group>
                    <Form.Label>Número do Cartão</Form.Label>
                    <Form.Control
                        type="text"
                        value={formCardValues.cardNumber}
                        onChange={(e) => setFormCardValues({ ...formCardValues, cardNumber: e.target.value })}
                        onFocus={() => handleFocus('cardNumber')}
                        onBlur={handleBlur}
                        maxLength="16"
                        placeholder="Número do Cartão"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Nome no Cartão</Form.Label>
                    <Form.Control
                        type="text"
                        value={formCardValues.cardOwner}
                        onChange={(e) => setFormCardValues({ ...formCardValues, cardOwner: e.target.value.toUpperCase() })}
                        onFocus={() => handleFocus('cardOwner')}
                        onBlur={handleBlur}
                        placeholder="Nome no Cartão"
                    />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group>
                            <Form.Label>Data de Validade</Form.Label>
                            <Form.Control
                                type="text"
                                value={formCardValues.expirationDate}
                                onChange={(e) => setFormCardValues({ ...formCardValues, expirationDate: e.target.value })}
                                onFocus={() => handleFocus('expirationDate')}
                                onBlur={handleBlur}
                                maxLength="5"
                                placeholder="MM/AA"
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                value={formCardValues.cvv}
                                onChange={(e) => setFormCardValues({ ...formCardValues, cvv: e.target.value })}
                                onFocus={() => handleFocus('cvv')}
                                onBlur={handleBlur}
                                maxLength="3"
                                placeholder="CVV"
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <div className="d-flex justify-content-end mt-5 ">
                <Button variant="yellow fw-bold" onClick={() => handleSubmit()}>Cadastrar Cartão</Button>
            </div>
        </>
    )
}
export default CardContent;