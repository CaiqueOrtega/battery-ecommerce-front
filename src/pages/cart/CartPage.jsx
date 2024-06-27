import { Card, Col, Row, Button, FormControl, Container, Accordion, Placeholder, Spinner, InputGroup, Form } from "react-bootstrap";
import { useGlobalDataProvider } from "../../context/GlobalDataProvider";
import exemploImageCart from "../../assets/images/exemploImageRegister.png";
import { AdditionIcon, SubtractionIcon, ShoppingCartIcon, PurchaseIcon, MapIcon, DeliveryIcon, ExclamationCircleIcon, ToEditIcon, AddSquareIcon, ErrorCircleFillIcon } from "../../assets/icons/IconsSet";
import BatteryCartServices from "../../services/cart/BatteryCartServices";
import AddressServices from "../../services/address/AddressServices";
import ConfirmChangesModal from "../../components/common/ConfirmChangesModal";
import ModalSelectedAddress from "../../components/common/ModalAddress";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './cart.css';
import FormValidations from "../../components/common/FormValidation";
import SaleStepsModal from "../sale/SaleStepsModal";
import PromotionService from "../../services/promotion/PromotionService";
import ToastComponent from "../../components/common/ToastComponent";

function CartPage() {
    const { batteryCart, setBatteryCart, batteryCartIsLoaded, isLoggedIn, address, setAddress, addressIsLoaded, fetchAddress, userData } = useGlobalDataProvider();
    const { getAddressCep, getFreight, errorMessages: addressErrorMessages, setErrorMessages: setAddressErrorMessages } = AddressServices();
    const { removeBattery, changeBatteryQuantity, addPromotion, removePromotion, errorMessages: batteryErrorMessages, setErrorMessages: setBatteryErrorMessages } = BatteryCartServices();
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});
    const [confirmAction, setConfirmAction] = useState({});
    const [freightValues, setFreightValues] = useState({});
    const [addressValues, setAddressValues] = useState({})
    const [formCEP, setFormCEP] = useState('');
    const [showSelectedAddressModal, setShowSelectedAddressModal] = useState(false);
    const [freightIsLoaded, setFreightIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await fetchAddress();
        };

        if (!addressIsLoaded) {
            fetchData();
        }

        if (address?.length > 0 && batteryCartIsLoaded) {
            let mainAddress = address.find(addr => addr.main === true) || address[0];
            handleGetFreightByCep(mainAddress.cep, mainAddress, false, batteryCart?.itemsQuantity);

        } else if (addressIsLoaded && batteryCartIsLoaded) {

            const hasLocalAddress = localStorage.getItem('cepAddress');

            if (hasLocalAddress) {
                handleGetAddressByCep(null, hasLocalAddress, false);
            } else {
                setFreightIsLoaded(true);
            }
        }
    }, [addressIsLoaded, batteryCartIsLoaded]);


    const handleGetAddressByCep = async (event, formCEP, isRequestModal) => {
        if (event?.preventDefault) {
            event.preventDefault();
        }

        if (formCEP !== addressValues.cep) {
            const response = await getAddressCep(formCEP);
            if (response) {
                if (Object.keys(address).length === 0) {
                    localStorage.setItem('cepAddress', formCEP);
                }

                let totalQuantity = batteryCart?.itemsQuantity || JSON.parse(localStorage.getItem('batteryCart'))?.itemsQuantity;

                if (totalQuantity) {
                    handleGetFreightByCep(formCEP, response, isRequestModal, totalQuantity);
                } else {
                    setFreightIsLoaded(true);
                }
            } else {
                setAddressErrorMessages({ cep: 'CEP inválido ou não encontrado' });
            }
        }
    };

    const handleGetFreightByCep = async (formCEP, addressValues, isRequestModal, itemsQuantity) => {
        const response = await getFreight(formCEP, itemsQuantity);
        if (response) {
            setFreightValues(response);
            if (isRequestModal) {
                setShowSelectedAddressModal(false)
            }
        }
        if (Object.keys(addressValues).length !== 0) {
            setAddressValues({ ...addressValues, selectedAddressCard: true });
        }
        setFreightIsLoaded(true)
    }

    const handleCartAction = async (action, data) => {
        const actions = {
            'remove': async () => {
                try {
                    let response = {};
                    if (isLoggedIn) {
                        response = await removeBattery(batteryCart.cartId, data.batteryId);
                    } else {
                        let localBatteryCart = localStorage.getItem('batteryCart');
                        if (localBatteryCart) {
                            localBatteryCart = JSON.parse(localBatteryCart);

                            localBatteryCart.batteries = localBatteryCart.batteries.filter(item =>
                                item.batteryId !== data.batteryId
                            );

                            if (localBatteryCart?.batteries?.length === 0) {
                                localStorage.removeItem('batteryCart');
                            } else {
                                const removedBattery = batteryCart.batteries.find(item => item.battery.batteryId === data.batteryId);

                                if (removedBattery) {
                                    localBatteryCart.totalValue -= (removedBattery.battery.value * removedBattery.quantity);
                                }

                                localBatteryCart.itemsQuantity = localBatteryCart.batteries.reduce((total, battery) => total + parseInt(battery.quantity, 10), 0);

                                localStorage.setItem('batteryCart', JSON.stringify(localBatteryCart));

                                response = {
                                    totalValue: localBatteryCart.totalValue,
                                    itemsQuantity: localBatteryCart.itemsQuantity
                                };
                            }
                        }
                    }
                    const updatedBatteryCart = {
                        ...batteryCart,
                        totalValue: response?.totalValue,
                        itemsQuantity: response?.itemsQuantity,
                        batteries: batteryCart.batteries.filter(item =>
                            item.battery.batteryId !== data.batteryId
                        )
                    };

                    setBatteryCart(updatedBatteryCart);
                    handleGetFreightByCep(addressValues.cep, {}, false, response.itemsQuantity);
                } catch (e) {
                    console.log('Erro ao remover bateria do carrinho', e);
                }
            },
            'changeQuantity': async () => {
                try {
                    let response;
                    if (isLoggedIn) {
                        response = await changeBatteryQuantity(batteryCart.cartId, data.cartBatteryId, data.quantity);
                    } else {
                        let localBatteryCart = localStorage.getItem('batteryCart');
                        if (localBatteryCart) {
                            localBatteryCart = JSON.parse(localBatteryCart);

                            localBatteryCart.totalValue = batteryCart.batteries.reduce((accumulator, battery) => {
                                if (battery.cart_battery_id === data.cartBatteryId) {
                                    return accumulator + (battery.battery.value * data.quantity);
                                }
                                return accumulator + (battery.battery.value * battery.quantity);
                            }, 0);

                            localBatteryCart.batteries = localBatteryCart.batteries.map(item => {
                                if (item.cart_battery_id === data.cartBatteryId) {
                                    return { ...item, quantity: data.quantity };
                                }
                                return item;
                            });

                            localBatteryCart.itemsQuantity = localBatteryCart.batteries.reduce((total, battery) => total + parseInt(battery.quantity, 10), 0)


                            localStorage.setItem('batteryCart', JSON.stringify(localBatteryCart));
                            response = {
                                totalValue: localBatteryCart.totalValue,
                                itemsQuantity: localBatteryCart.itemsQuantity
                            };
                        }
                    }
                    if (response && Object.keys(response).length > 0) {
                        const updatedBatteryCart = {
                            ...batteryCart,
                            totalValue: response.totalValue,
                            itemsQuantity: response.itemsQuantity,
                            batteries: batteryCart.batteries.map(item => {
                                if (item.cart_battery_id === data.cartBatteryId) {
                                    return { ...item, quantity: data.quantity };
                                }
                                return item;
                            })
                        };
                        setBatteryCart(updatedBatteryCart);
                        handleGetFreightByCep(addressValues.cep, {}, false, response.itemsQuantity)
                    }
                } catch (e) {
                    console.log('erro ao mudar quantidade de bateria do carrinho', e)
                }
            },
        };

        if (actions[action]) {
            await actions[action]();
        }
    }

    const handleConfirmChangesModal = async () => {
        if (confirmAction) {
            const { action, data } = confirmAction;
            await handleCartAction(action, data);
        }
    };

    return (
        <>
            <Container className="py-5" style={{ maxWidth: 1140 }}>
                <Row>
                    <Col md={8}>
                        <RenderCartItemsCard
                            batteryCart={batteryCart}
                            setShowConfirmChangesModal={setShowConfirmChangesModal}
                            setConfirmChangesModalData={setConfirmChangesModalData}
                            setConfirmAction={setConfirmAction}
                            handleCartAction={handleCartAction}
                            batteryCartIsLoaded={batteryCartIsLoaded}
                            address={address}
                            isLoggedIn={isLoggedIn}
                            formCEP={formCEP}
                            setFormCEP={setFormCEP}
                            handleGetAddressByCep={handleGetAddressByCep}
                            handleGetFreightByCep={handleGetFreightByCep}
                            freightValues={freightValues}
                            addressValues={addressValues}
                            showSelectedAddressModal={showSelectedAddressModal}
                            setShowSelectedAddressModal={setShowSelectedAddressModal}
                            freightIsLoaded={freightIsLoaded}
                            addressErrorMessages={addressErrorMessages}
                            setBatteryCart={setBatteryCart}
                            addPromotion={addPromotion}
                            removePromotion={removePromotion}
                            batteryErrorMessages={batteryErrorMessages}
                        />
                    </Col>

                    <Col >
                        <RenderCartSummaryCard batteryCart={batteryCart}
                            batteryCartIsLoaded={batteryCartIsLoaded}
                            freightValues={freightValues}
                            setFreightValues={setFreightValues}
                            addressIsLoaded={addressIsLoaded}
                            address={address}
                            setAddress={setAddress}
                            isLoggedIn={isLoggedIn}
                            userData={userData}
                            addressValues={addressValues}
                            freightIsLoaded={freightIsLoaded}
                            setAddressValues={setAddressValues}
                            addressErrorMessages={addressErrorMessages}
                            setBatteryCart={setBatteryCart}
                        />
                    </Col>
                </Row>
            </Container>

            <ConfirmChangesModal
                showConfirmChangesModal={showConfirmChangesModal}
                setShowConfirmChangesModal={setShowConfirmChangesModal}
                handleConfirmChanges={handleConfirmChangesModal}
                confirmChangesModalData={confirmChangesModalData}
            />
        </>
    );
}

function RenderCartItemsCard({ batteryCart, setShowConfirmChangesModal, setConfirmChangesModalData, setConfirmAction, handleCartAction, batteryCartIsLoaded, isLoggedIn, address, formCEP, setFormCEP, handleGetAddressByCep, handleGetFreightByCep, freightValues, addressValues, showSelectedAddressModal, setShowSelectedAddressModal, freightIsLoaded, addressErrorMessages, addPromotion, setBatteryCart, removePromotion, batteryErrorMessages }) {
    const { ExtractNumericValue } = FormValidations();
    const [showPopover, setShowPopover] = useState(false);
    const [formPromotionValue, setFormPromotionValue] = useState('');
    const [disableFormPromotionCode, setDisableFormPromotionCode] = useState(false)
    const [showPopoverPromotion, setShowPopoverPromotion] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (batteryCartIsLoaded && batteryCart?.promotion?.code) {
            setFormPromotionValue(batteryCart.promotion.code);
            setDisableFormPromotionCode(true);
        }
    }, [batteryCartIsLoaded])

    const handleRemoveBattery = (batteryId) => {
        setShowConfirmChangesModal(true)
        setConfirmChangesModalData({ title: "Remover Bateria", message: "Deseja mesmo Remover a Bateria do Carrinho?" })
        setConfirmAction({ action: 'remove', data: { batteryId: batteryId } });
    }

    const handleChange = (e, setLocalQuantity, batteryQuantity) => {
        let newQuantity = parseInt(e.target.value);
        console.log(newQuantity);
        if (newQuantity <= 0) {
            newQuantity = 1;
        } else if (newQuantity > batteryQuantity) {
            newQuantity = batteryQuantity;
        }
        setLocalQuantity(ExtractNumericValue(newQuantity))
    }

    const handleBlur = (localQuantity, setLocalQuantity, cartBatteryId, setPrevQuantity, prevQuantity) => {
        if (prevQuantity !== localQuantity) {
            if (localQuantity.trim() !== '' && localQuantity !== '0') {
                setPrevQuantity(localQuantity)
                handleCartAction('changeQuantity', { cartBatteryId: cartBatteryId, quantity: localQuantity })
            } else {
                setLocalQuantity(prevQuantity);
            }
        }
    }

    const handleChangeQuantity = (isAddition, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef, batteryQuantity, setPrevQuantity) => {
        let newQuantity;
        let currentQuantity = parseInt(localQuantity)
        if (isAddition) {
            newQuantity = Math.min(batteryQuantity, currentQuantity + 1);
        } else {
            newQuantity = Math.max(1, currentQuantity - 1);
        }

        if (newQuantity !== currentQuantity) {
            setLocalQuantity(ExtractNumericValue(newQuantity));
            setPrevQuantity(ExtractNumericValue(newQuantity))
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            timeoutIdRef.current = setTimeout(() => {
                handleCartAction('changeQuantity', { cartBatteryId: cartBatteryId, quantity: newQuantity })
            }, 1000);
        }
    };

    const BatteryQuantityControl = ({ quantity, batteryQuantity, cartBatteryId }) => {
        const [localQuantity, setLocalQuantity] = useState(quantity.toString());
        const [prevQuantity, setPrevQuantity] = useState(quantity.toString());


        const timeoutIdRef = useRef(null);

        useEffect(() => {
            return () => {
                if (timeoutIdRef.current) {
                    clearTimeout(timeoutIdRef.current);
                }
            };
        }, []);

        return (
            <Card style={{ maxWidth: '130px' }}>
                <Row className='g-0'>
                    <Col className='col-auto'>
                        <Button variant={`white fw-bold rounded-end-0 ${localQuantity === 1 ? 'bg-light' : ''}`}
                            onMouseDown={() => handleChangeQuantity(false, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef, batteryQuantity, setPrevQuantity)}
                        ><SubtractionIcon size={15} /></Button>
                    </Col>
                    <Col className='d-flex align-items-center'>
                        <FormControl
                            type="text"
                            className="flex-grow-0 text-center py-1 border-0"
                            value={localQuantity}
                            onBlur={() => handleBlur(localQuantity, setLocalQuantity, cartBatteryId, setPrevQuantity, prevQuantity)}
                            onChange={(e) => handleChange(e, setLocalQuantity, batteryQuantity)}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <Button variant={`white fw-bold rounded-start-0 ${batteryQuantity === localQuantity ? 'bg-light' : ''}`}
                            onMouseDown={() => handleChangeQuantity(true, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef, batteryQuantity, setPrevQuantity)}
                        >
                            <AdditionIcon size={15} />
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    };

    const getEstimatedArrivalDate = (estimateDays) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + estimateDays);
        const options = { day: 'numeric', month: 'long' };
        return currentDate.toLocaleDateString('pt-BR', options);
    };

    const handlePromotionCode = async (code) => {
        if (!disableFormPromotionCode) {
            if (code) {
                const response = await addPromotion(batteryCart.cartId, code);
                if (response) {
                    setBatteryCart(response);
                    setDisableFormPromotionCode(true);
                }else{
                    setShowToast(true);
                }
            } else if (batteryCart?.promotion) {
                const response = await removePromotion(batteryCart.cartId)
                if (response) {
                    setBatteryCart(response);
                }else{
                    setShowToast(true);
                }
            }
        } else {
            setDisableFormPromotionCode(false);
        }
    }

    return (
        <>
            <div className='position-fixed top-0 end-0 mt-2 me-2' style={{ zIndex: 1350 }}>
                <ToastComponent
                    icon={<ErrorCircleFillIcon />}
                    message={batteryErrorMessages.general}
                    showToast={showToast}
                    setShowToast={setShowToast}
                />
            </div>
            <Card className={`border-0 shadow ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light' : ''}`}>
                <Card.Header className={`py-0 fw-bold ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light text-muted' : 'bg-white'}`}>
                    <div className="d-flex justify-content-between">
                        <span className=" py-3 ">
                            Carrinho de Baterias
                        </span>
                        {isLoggedIn ? (
                            batteryCart?.batteries?.length > 0 && (
                                <div className="d-flex align-items-center position-relative" style={{ maxWidth: 220 }}>
                                    <FormControl
                                        value={formPromotionValue}
                                        onChange={(e) => setFormPromotionValue(e.target.value)}
                                        className="form-control-sm"
                                        placeholder={"Cupom de Desconto"}
                                        disabled={disableFormPromotionCode}
                                    />

                                    <div className='position-absolute top-50 end-0 translate-middle-y d-flex justify-content-center px-2 me-1 z-3'>
                                        <a className="small text-muted" type="submit" onClick={() => handlePromotionCode(formPromotionValue)}>
                                            {disableFormPromotionCode ? <ToEditIcon /> : <AddSquareIcon />}
                                        </a>
                                    </div>

                                </div>
                            )
                        ) : (
                            <div className="fw-normal d-flex align-items-center position-relative">
                                <span className="small text-muted">Cupom de desconto</span>

                                <div
                                    className="input-progress-container position-absolute z-1 "
                                    style={{
                                        position: 'absolute',
                                        top: '90%',
                                        right: -20,
                                        visibility: showPopoverPromotion ? 'visible' : 'hidden',
                                        width: 250
                                    }}
                                >
                                    <div className="popover shadow-sm">
                                        <div className='popover-header py-1'>
                                            <span className='small'>Promoções indisponíveis</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center popover-content p-2">
                                            <span>
                                                Entre ou se cadastre para ter acesso aos cupons promocionais!
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <a
                                    className='float-end ms-2 z-3 position-relative text-muted'
                                    type="button"
                                    onMouseOver={() => setShowPopoverPromotion(true)}
                                    onMouseOut={() => setShowPopoverPromotion(false)}
                                >
                                    <ExclamationCircleIcon />
                                </a>
                            </div>
                        )}
                    </div>
                </Card.Header>

                <Card.Body className="overflow-auto custom-scrollbar" style={{ height: batteryCart && Object.keys(batteryCart).length > 0 && batteryCart?.batteries?.length > 0 ? 350 : 389 }}>
                    {!batteryCartIsLoaded ? (
                        <div className="d-flex flex-grow-1 align-items-center justify-content-center h-100">
                            <span className="loader"></span>
                        </div>
                    ) : (
                        <>
                            {batteryCart && Object.keys(batteryCart).length > 0 && batteryCart?.batteries?.length > 0 ? (
                                <>
                                    {batteryCart?.batteries?.map(item => (
                                        <Row key={item.cart_battery_id} className="px-3 mt-2 d-flex align-items-center">
                                            <Col xs={2} md={2} className="p-0">
                                                <img src={exemploImageCart} height={80} className="img-fluid" alt="Battery" />
                                            </Col>

                                            <Col md={5} xs={9} className="ms-3 lh-md p-0 ">
                                                <h6 className="mb-0 text-wrap">
                                                    {item.battery.name.length > 30 ? item.battery.name.substring(0, 30) + "..." : item.battery.name}
                                                </h6>
                                                <a type="button" className="small text-muted" onClick={() => handleRemoveBattery(item.battery.batteryId)}>Remover</a>
                                            </Col>

                                            <Col className="col-auto d-flex flex-column align-items-center small position-relative" >
                                                <BatteryQuantityControl quantity={item.quantity} cartBatteryId={item.cart_battery_id} batteryQuantity={item.battery.quantity} />

                                                <span className="text-muted small position-absolute" style={{ bottom: -17 }}>
                                                    {item.battery.quantity} unidade{item.battery.quantity > 1 && 's'}
                                                </span>
                                            </Col>

                                            <Col className="d-flex align-items-center">
                                                <span className="ms-auto font-numbers">R$ {item.battery.value.toFixed(2).replace('.', ',')}</span>
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <section className="d-flex  align-items-center justify-content-center h-100 py-5">
                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                            <ShoppingCartIcon />
                                            <span className="mt-2">Seu carrinho de compras está vazio!</span>
                                            <span className="text-muted small">Adicione baterias para continuar com sua compra</span>

                                            <Button as={Link} to="/" variant="yellow mt-4 fw-bold w-100 py-2">Ver Baterias Disponíveis</Button>
                                        </div>
                                    </section>
                                </>
                            )}

                        </>
                    )}
                </Card.Body>
                {batteryCartIsLoaded && batteryCart?.batteries?.length > 0 ? (
                    <Card.Footer className="bg-light px-4">
                        <>
                            {freightIsLoaded ? (
                                <div className="d-flex justify-content-between">
                                    {!addressValues?.cep ? (
                                        <a type="button" className="text-muted" onClick={() => setShowSelectedAddressModal(true)}>Calcular Frete</a>
                                    ) : (

                                        <a type="button" className="text-muted small" onClick={() => setShowSelectedAddressModal(true)}>

                                            <MapIcon size={'15px'} />
                                            <span className="ms-1">
                                                {addressValues?.address}, {addressValues?.number}, {addressValues?.city}, {addressValues?.state}
                                            </span>
                                        </a>
                                    )}

                                    <span className="text-muted small d-flex align-items-center"><DeliveryIcon size={18} />
                                        <span className="mx-1">
                                            Recebe até
                                        </span>
                                        {!freightValues?.totalFreightCost ? (
                                            <>
                                                <div
                                                    className="input-progress-container position-absolute z-1 mt-2"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        right: 0,
                                                        visibility: showPopover ? 'visible' : 'hidden'
                                                    }}
                                                >
                                                    <div className="popover shadow-sm">
                                                        <div className='popover-header py-1'>
                                                            <span className='small'>Frete Não Calculado</span>
                                                        </div>
                                                        <div className="d-flex align-items-center justify-content-center popover-content p-2">
                                                            <span>
                                                                {addressErrorMessages.freight ? (
                                                                    <>
                                                                        Erro ao Calcular o frete, tente novamente mais tarde
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Por favor, insira um CEP ou selecione um endereço para calcular o valor do frete.
                                                                    </>

                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <a
                                                    className='float-end ms-2 z-3 position-relative text-muted'
                                                    type="button"
                                                    onMouseOver={() => setShowPopover(true)}
                                                    onMouseOut={() => setShowPopover(false)}
                                                >
                                                    <ExclamationCircleIcon />
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                {getEstimatedArrivalDate(freightValues?.estimateDays)}
                                                <span className="text-success ms-1 font-numbers">
                                                    - R${freightValues?.totalFreightCost?.toFixed(2).replace('.', (','))}
                                                </span>
                                            </>
                                        )}

                                    </span>
                                </div>
                            ) : (
                                <Placeholder as='span' animation="glow" className="small d-flex justify-content-between">
                                    <Placeholder xs={5} />
                                    <Placeholder xs={4} />
                                </Placeholder>
                            )
                            }
                        </>

                    </Card.Footer>
                ) : null}
            </Card >
            <ModalSelectedAddress
                address={address}
                setShowSelectedAddressModal={setShowSelectedAddressModal}
                showSelectedAddressModal={showSelectedAddressModal}
                handleGetFreightByCep={handleGetFreightByCep}
                formCEP={formCEP}
                setFormCEP={setFormCEP}
                handleGetAddressByCep={handleGetAddressByCep}
                isLoggedIn={isLoggedIn}
                errorMessages={addressErrorMessages}
            />
        </>
    )
}

function RenderCartSummaryCard({ batteryCart, setBatteryCart, batteryCartIsLoaded, addressIsLoaded, address, setAddress, isLoggedIn, userData, addressValues, setAddressValues, freightValues, freightIsLoaded, addressErrorMessages }) {
    const [showPopover, setShowPopover] = useState(false);
    const [showSaleStepsModal, setShowSaleStepsModal] = useState();
    const [steps, setSteps] = useState('address');

    const handleContinueSale = () => {
        setShowSaleStepsModal(true);
    }
    return (
        <>
            <Card className={`border-0 shadow h-100  ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light' : ''}`}>
                <Card.Header className={`fw-bold py-3 ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light text-muted' : 'bg-white'}`} >
                    Resumo da compra
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-between px-4 overflow-auto" style={{ height: batteryCart && Object.keys(batteryCart).length !== 0 && batteryCart?.batteries?.length !== 0 ? 350 : 389 }}>

                    {!batteryCartIsLoaded ? (
                        <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                            <span className="loader"></span>
                        </div>
                    ) : (
                        <>
                            {batteryCart && Object.keys(batteryCart).length != 0 && batteryCart?.batteries?.length != 0 ? (
                                <>
                                    <section>
                                        <Accordion defaultActiveKey="0" flush>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Button className="d-flex justify-content-between p-0">
                                                    <span className="small">
                                                        Produtos ({batteryCart?.batteries?.length})
                                                    </span>
                                                </Accordion.Button>
                                                <Accordion.Body className="p-0 overflow-auto custom-scrollbar" style={{ MaxHeight: 175 }}>
                                                    <hr className="opacity-25" />

                                                    {batteryCart?.batteries.map((items, index) => (
                                                        <div key={items.cart_battery_id} className={`${index > 0 ? 'mt-2' : ''} d-flex justify-content-between align-items-center`}>
                                                            <span className="small ">
                                                                {items.battery.name.length > 20 ? items.battery.name.substring(0, 20) + '...' : items.battery.name}
                                                                <span className="text-muted"> <span className="small">x</span>{items.quantity}</span>
                                                            </span>
                                                            <span className="font-numbers small">R${(items.battery.value * items.quantity).toFixed(2).replace('.', ',')}</span>
                                                        </div>
                                                    ))}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        <hr className="opacity-25" />
                                        <div className="d-flex justify-content-between small my-1">
                                            <span>SubTotal</span>
                                            {batteryCart?.promotion ? (
                                                <div className="d-flex flex-column">
                                                    <span>
                                                        <s className="ms-1" style={{ top: '10%' }}>
                                                            R${(batteryCart.totalValue / (1 - batteryCart.promotion.percentage / 100)).toFixed(2).replace('.', ',')}
                                                        </s>
                                                        <sup className="text-success">{batteryCart.promotion.percentage}%</sup>
                                                        <span className="fw-bold">R${batteryCart.totalValue.toFixed(2).replace('.', ',')}</span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <span>R${batteryCart.totalValue.toFixed(2).replace('.', ',')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between position-relative">
                                            <span className="small">Valor Frete</span>
                                            <span>
                                                {freightIsLoaded ? (
                                                    <>
                                                        {freightValues?.totalFreightCost ? (
                                                            <span className="font-numbers small">
                                                                R$ {freightValues.totalFreightCost.toFixed(2).replace('.', ',')}
                                                            </span>
                                                        ) : (
                                                            addressIsLoaded && !localStorage.getItem('addressCep') && address.length === 0 ? (
                                                                <>
                                                                    <div className="input-progress-container position-absolute z-1 mt-2" style={{ position: 'absolute', top: '100%', right: -20, visibility: showPopover ? 'visible' : 'hidden' }}>
                                                                        <div className="popover shadow-sm">
                                                                            <div className='popover-header py-1'>
                                                                                <span className='small'>Frete Não Calculado</span>
                                                                            </div>
                                                                            <div className="d-flex align-items-center justify-content-center popover-content p-2">
                                                                                <span>
                                                                                    {addressErrorMessages?.freight ? (
                                                                                        <>
                                                                                            Erro ao Calcular o frete, tente novamente mais tarde
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            Por favor, insira um CEP ou selecione um endereço para calcular o valor do frete.
                                                                                        </>
                                                                                    )}

                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <a
                                                                        className='float-end ms-2 text-muted z-3 position-relative'
                                                                        type="button"
                                                                        onMouseOver={() => setShowPopover(true)}
                                                                        onMouseOut={() => setShowPopover(false)}
                                                                    >
                                                                        <ExclamationCircleIcon />
                                                                    </a>
                                                                </>
                                                            ) : null
                                                        )}
                                                    </>
                                                ) : (
                                                    <Spinner size="sm" animation="border" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </Spinner>
                                                )}

                                            </span>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="d-flex justify-content-between" style={{ fontSize: '18px' }}>
                                            <span className="fw-bold ">Total</span>
                                            <span className="fw-bold font-numbers">R$
                                                <span className="ms-2">
                                                    {(
                                                        ((batteryCart?.discountedValue) ?? (batteryCart?.totalValue)) + (freightValues?.totalFreightCost || 0)
                                                    ).toFixed(2).replace('.', ',')}
                                                </span>
                                            </span>
                                        </div>
                                        <Button variant={`yellow ${!freightIsLoaded ? 'disabled-button' : ''} fw-bold w-100 py-2 mt-2`} disabled={!freightIsLoaded} onClick={() => handleContinueSale()}>Continuar a Compra</Button>
                                    </section>
                                </>
                            ) : (
                                <section className="d-flex align-items-center justify-content-center flex-grow-1">

                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <PurchaseIcon />
                                        <span className="text-muted small mt-3">Assim que você adicionar produtos ao carrinho, verá aqui o resumo dos valores da sua compra.</span>
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                </Card.Body>
            </Card >

            {showSaleStepsModal && (
                <SaleStepsModal
                    showSaleStepsModal={showSaleStepsModal}
                    setShowSaleStepsModal={setShowSaleStepsModal}
                    isLoggedIn={isLoggedIn}
                    addressValues={addressValues}
                    setAddressValues={setAddressValues}
                    freightValues={freightValues}
                    address={address}
                    setAddress={setAddress}
                    userData={userData}
                    steps={steps}
                    setSteps={setSteps}
                    batteryCart={batteryCart}
                    setBatteryCart={setBatteryCart}
                />
            )
            }
        </>
    )
}

export default CartPage;