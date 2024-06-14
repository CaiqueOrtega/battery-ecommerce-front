import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { MapIcon, DeliveryIcon, MotorcycleIcon, SubtractionIcon, AdditionIcon, ShieldCheckIcon, BackIcon, MedalIcon } from '../../assets/icons/IconsSet';
import { Card, Container, Row, Col, Button, FormControl, Form, InputGroup, Placeholder } from 'react-bootstrap';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';

import ImageGalleryComponent from './image/imageGallery';
import ModalSelectedAddress from '../../components/common/ModalAddress';
import BatteryCartServices from '../../services/cart/BatteryCartServices';
import AddressServices from '../../services/address/AddressServices';

import { useAuthProvider } from '../../context/AuthProvider';
import { useGlobalDataProvider } from '../../context/GlobalDataProvider';
import './batteryPurchasePage.css';
import FormValidations from '../../components/common/FormValidation';

function BatteryPurchasePage() {
    const location = useLocation();
    const batteryData = location.state;
    const [quantity, setQuantity] = useState('1');
    const { addBattery, errorMessages, setErrorMessages } = BatteryCartServices();

    const { fetchAddress, address, batteryCart, setBatteryCart, addressIsLoaded, } = useGlobalDataProvider();
    const { isLoggedIn } = useAuthProvider();

    const [formCEP, setFormCEP] = useState('');
    const [prevFormCEP, setPrevFormCEP] = useState({})

    const { getFreight, getAddressCep } = AddressServices();
    const [freightValues, setFreightValues] = useState({});

    const [addressValues, setAddressValues] = useState({})
    const [showSelectedAddressModal, setShowSelectedAddressModal] = useState(false);


    const handleAddBatteryToCart = async () => {
        if (isLoggedIn && batteryCart) {
            await addBatteryToServerCart();
        } else {
            addBatteryToLocalCart();
        }
    }

    const addBatteryToServerCart = async () => {
        const response = await addBattery(batteryCart.cartId, batteryData.batteryId, quantity);
        if (response) {
            setBatteryCart(response);
        }
    }

    const addBatteryToLocalCart = () => {
        let batteriesAddCart = [];
        let totalValue = 0;

        const storedCart = localStorage.getItem('batteryCart');
        const cartData = JSON.parse(storedCart);
        console.log(cartData)
        const isBatteryInCart = cartData?.batteries?.some(battery => battery.batteryId === batteryData.batteryId);

        if (!isBatteryInCart) {
            if (storedCart) {
                batteriesAddCart = cartData.batteries;
                totalValue = cartData.totalValue + (batteryData.value * quantity);

                if (batteriesAddCart.some(battery => battery.batteryId === batteryData.batteryId)) {
                    batteriesAddCart.forEach(battery => {
                        if (battery.batteryId === batteryData.batteryId) {
                            battery.quantity += quantity;
                        }
                    });
                } else {
                    batteriesAddCart.push({
                        cart_battery_id: Math.floor(Math.random() * 1000000),
                        batteryId: batteryData.batteryId,
                        quantity: quantity
                    });
                }

            } else {
                totalValue = batteryData.value * quantity;
                batteriesAddCart.push({
                    cart_battery_id: Math.floor(Math.random() * 1000000),
                    batteryId: batteryData.batteryId,
                    quantity: quantity
                });
            }

            const newItem = {
                cartId: Math.floor(Math.random() * 1000000),
                totalValue: totalValue,
                batteries: batteriesAddCart
            };

            try {
                localStorage.setItem('batteryCart', JSON.stringify(newItem));

                setBatteryCart({
                    cardId: newItem.cartId,
                    totalValue: newItem.totalValue || 0,
                    promotion: null,
                    batteries: [
                        ...(batteryCart?.batteries || []),
                        {
                            cart_battery_id: (batteriesAddCart.length > 0 ? batteriesAddCart[batteriesAddCart.length - 1].cart_battery_id : null),
                            quantity: quantity,
                            battery: batteryData
                        }
                    ]
                });
            } catch (e) {
                if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                    console.error("Não há espaço suficiente no localStorage para adicionar a bateria.");

                } else {
                    console.error("Ocorreu um erro ao tentar adicionar a bateria ao carrinho:", e);

                }
            }

        } else {
            console.log("A bateria ja esta no carrinho")
        }
    }

    const handleGetAddressByCep = async (event, formCEP, isRequestModal) => {
        if (event instanceof Object && event !== null && event.preventDefault) {
            event.preventDefault();
        }

        if (formCEP != prevFormCEP) {
            const response = await getAddressCep(formCEP);
            if (response) {
                if (Object.keys(address).length === 0) {
                    localStorage.setItem('cepAddress', formCEP);
                }
                setPrevFormCEP(formCEP);
                handleGetFreightByCep(formCEP, response, isRequestModal, quantity);
            } else {
                setErrorMessages({ cep: 'CEP inválido ou não encontrado' })
            }
        }
    }

    const handleGetFreightByCep = async (formCEP, addressValues, isRequestModal, quantity) => {
        setFreightValues({});
        setAddressValues({});
        const response = await getFreight(formCEP, quantity);
        if (response) {
            setFreightValues(response);
            setAddressValues(addressValues);

            if (isRequestModal) {
                setShowSelectedAddressModal(false)
            }
        }
    }

    const renderFreightCards = () => {
        return (
            <Card>
                <Card.Header type='button' className='small px-2 text-decoration-underline' onClick={() => setShowSelectedAddressModal(true)} >
                    {Object.keys(addressValues).length != 0 ? (
                        <>
                            <MapIcon size={'15px'} />
                            <span className='ms-1'>
                                {addressValues?.logradouro || addressValues?.localidade}, {addressValues?.bairro || addressValues?.uf}
                            </span>
                        </>
                    ) : (
                        <Placeholder as='span' animation="glow" className="text-muted small">
                            <Placeholder xs={9} />
                        </Placeholder>
                    )
                    }
                </Card.Header>
                <Card.Body className='card-body-freight pt-1'>

                    {freightValues && Object.keys(freightValues).length > 0 ? (
                        <section>
                            <span className='text-muted small'>
                                Frete: R${freightValues.totalFreightCost.toFixed(2)} (SEDEX)
                            </span>
                            <br />
                            <span className='text-muted small'>
                                <DeliveryIcon size={'18px'} /> Você receberá em até {freightValues.estimateDays} dia{freightValues.estimateDays > 1 ? 's' : ''}
                            </span>
                            <hr className='mb-0' />
                        </section>
                    ) : (
                        <section>
                            <Placeholder as='span' animation="glow" className="text-muted small">
                                <Placeholder xs={12} />
                            </Placeholder>
                            <br />
                            <Placeholder as='span' animation="glow" className="text-muted small">
                                <Placeholder xs={9} />
                            </Placeholder>
                            <hr className='mb-0' />
                        </section>
                    )}
                </Card.Body>
            </Card>
        );
    }

    return (
        <>
            <Container className="purchase-container py-lg-5" >
                <Card className="border-0 shadow " >
                    <Card.Body className="py-4">
                        <Row className="d-flex">
                            <Col className='col-12 col-md-auto'>
                                <ImageGalleryComponent />
                            </Col>

                            <Col className='col-12 col-sm-6 col-lg flex-grow-1 mt-lg-0 mt-4'>
                                <div>
                                    <h4 className='text-muted'>{batteryData.name}</h4>
                                    <p className="text-muted">{batteryData.description}</p>
                                </div>
                            </Col>

                            <Col className='col-12 col-sm-6 col-lg-auto purchase-col-card mt-lg-0 mt-4'>
                                <CardBatteryPurchase
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                    batteryData={batteryData}
                                    formCEP={formCEP}
                                    setFormCEP={setFormCEP}
                                    handleAddBatteryToCart={handleAddBatteryToCart}
                                    handleGetAddressByCep={handleGetAddressByCep}
                                    handleGetFreightByCep={handleGetFreightByCep}
                                    renderFreightCards={renderFreightCards}
                                    fetchAddress={fetchAddress}
                                    addressIsLoaded={addressIsLoaded}
                                    address={address}
                                    isLoggedIn={isLoggedIn}
                                    errorMessages={errorMessages}
                                    addressValues={addressValues}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container >

            <ModalSelectedAddress
                address={address}
                setShowSelectedAddressModal={setShowSelectedAddressModal}
                showSelectedAddressModal={showSelectedAddressModal}
                handleGetFreightByCep={handleGetFreightByCep}
                formCEP={formCEP}
                setFormCEP={setFormCEP}
                handleGetAddressByCep={handleGetAddressByCep}
                isLoggedIn={isLoggedIn}
                quantity={quantity}
            />
        </>
    );
}

function CardBatteryPurchase(props) {
    const timeoutIdRef = useRef(null);
    const [prevQuantity, setPrevQuantity] = useState(props.quantity);
    const { ExtractNumericValue } = FormValidations()
    useEffect(() => {
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);


    const handleQuantityChange = (isAddition) => {
        let newQuantity;
        let currentQuantity = parseInt(props.quantity)
        if (isAddition) {
            newQuantity = Math.min(props.batteryData.quantity, currentQuantity + 1);
        } else {
            newQuantity = Math.max(1, currentQuantity - 1);
        }

        if (newQuantity !== currentQuantity) {
            props.setQuantity(newQuantity.toString());

            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            timeoutIdRef.current = setTimeout(() => {
                if (props.addressValues && Object.keys(props.addressValues).length > 0) {
                    props.handleGetFreightByCep(props.addressValues.cep, props.addressValues, false, newQuantity)
                }
                setPrevQuantity(ExtractNumericValue(newQuantity))
            }, 1000);
        }
    };

    const handleChange = (e) => {
        let newQuantity = parseInt(e.target.value);
        console.log(newQuantity);
        if (newQuantity <= 0 ) {
            newQuantity = 1;
        } else if (newQuantity > props.batteryData.quantity) {
            newQuantity = props.batteryData.quantity;
        }
        props.setQuantity(ExtractNumericValue(newQuantity))
    }

    const handleBlur = (e) => {
        if (prevQuantity !== e.target.value) {
            if (e.target.value.trim() !== '' && e.target.value !== '0') {
                setPrevQuantity(props.quantity)
                if (props.addressValues && Object.keys(props.addressValues).length > 0) {
                    props.handleGetFreightByCep(props.addressValues.cep, props.addressValues, false, props.quantity)
                }
            } else {
                props.setQuantity(prevQuantity);
            }
        }
    }

    return (
        <Card className='card-value-purchase shadow-sm h-100'>
            <Card.Header className='d-flex flex-column justify-content-center py-3 mb-0' style={{ background: '#F5F5F5' }}>
                <div className="lh-1">
                    <h4 className='mb-0'>R$ {props.batteryData.value}</h4>
                    <span className='text-success'>Em 5x R$ {(props.batteryData.value / 5).toFixed(2)} sem juros</span>
                </div>
                <span className='mt-2 text-muted small'><MotorcycleIcon /> Vendido por MacDavis Motos</span>
            </Card.Header>

            <Card.Body className=' d-flex flex-column justify-content-between'>
                <RenderInputOrCard
                    fetchAddress={props.fetchAddress}
                    addressIsLoaded={props.addressIsLoaded}
                    address={props.address}
                    handleGetAddressByCep={props.handleGetAddressByCep}
                    renderFreightCards={props.renderFreightCards}
                    isLoggedIn={props.isLoggedIn}
                    formCEP={props.formCEP}
                    setFormCEP={props.setFormCEP}
                    handleGetFreightByCep={props.handleGetFreightByCep}
                    errorMessages={props.errorMessages}
                    quantity={props.quantity}
                />

                <div className='h-100 d-flex flex-column justify-content-between'>
                    <section className='mb-3 pb-1 mt-3'>
                        <div className='lh-sm mb-3'>
                            <h6 className='fw-bold mb-0'>Estoque disponível</h6>
                            <span>disponível: <span className='fw-bold'> {props.batteryData.quantity} unidades</span></span>
                        </div>

                        <Card className="d-flex">
                            <Row className='g-0'>
                                <Col className='col-auto'>
                                    <Button variant="white fw-bold rounded-end-0 px-3 " onClick={() => handleQuantityChange(false)}><SubtractionIcon /></Button>
                                </Col>
                                <Col className='d-flex align-items-center'>
                                    <FormControl
                                        type="text"
                                        className="flex-grow-0 text-center py-1 border-0"
                                        value={props.quantity.toString()}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Col>
                                <Col className='col-auto'>
                                    <Button variant="white fw-bold rounded-start-0 px-3 " onClick={() => handleQuantityChange(true)}><AdditionIcon /></Button>
                                </Col>
                            </Row>
                        </Card>
                    </section>
                </div>

                <div>
                    <Button variant='yellow py-2 fw-bold w-100 mb-2'>Comprar</Button>
                    <Button variant='red-outline py-2 fw-bold w-100'
                        onClick={() => props.handleAddBatteryToCart()}>
                        Adicionar ao Carrinho
                    </Button>
                </div>

            </Card.Body>
        </Card>
    )
}


function RenderInputOrCard({ address, fetchAddress, addressIsLoaded, handleGetAddressByCep, handleGetFreightByCep, renderFreightCards, formCEP, setFormCEP, errorMessages, isLoggedIn, quantity }) {

    const initialize = async () => {
        if (!addressIsLoaded) {
            await fetchAddress();
        }
        if (address && Object.keys(address).length !== 0) {
            let mainAddress = address.find(addr => addr.main === true) || address[0];

            handleGetFreightByCep(
                mainAddress.cep,
                {
                    logradouro: mainAddress.address,
                    cep: mainAddress.cep,
                    cidade: mainAddress.city,
                    complemento: mainAddress.complement,
                    bairro: mainAddress.neighborhood,
                    numero: mainAddress.number,
                    estado: mainAddress.state
                },
                false,
                quantity
            );
        } else if (addressIsLoaded) {
            const hasLocalAddress = localStorage.getItem('cepAddress');
            if (hasLocalAddress) {
                handleGetAddressByCep(null, hasLocalAddress, false);
            }
        }
    };

    useEffect(() => {
        initialize();
    }, [addressIsLoaded]);


    if (address && Object.keys(address).length !== 0 || localStorage.getItem('cepAddress')) {
        return renderFreightCards();
    } else {
        return (
            <section>
                <span>Calcular frete</span>
                <Form onSubmit={(e) => handleGetAddressByCep(e, formCEP, false)}>
                    <InputGroup className='input-group-cep-container flex-nowrap'>
                        <FormGroupWithIcon
                            icon={<MapIcon className='position-absolute ms-3' currentColor='#333' />}
                            type={'text'}
                            placeholder={'Digite o CEP'}
                            value={formCEP}
                            onChange={(e) => setFormCEP(e.target.value)}
                            feedback={errorMessages.cep}
                            className={"input-group-cep"}
                        />
                        <Button type="submit" variant={`red ${errorMessages?.cep ? 'input-group-btn-cep-margin-top' : ''}`}>ok</Button>

                    </InputGroup>
                </Form>
            </section>
        );
    }
}


export default BatteryPurchasePage;



