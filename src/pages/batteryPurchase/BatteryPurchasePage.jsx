import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Row, Col, Button, FormControl, Form, InputGroup, Toast, Modal } from 'react-bootstrap';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import { MapIcon, DeliveryIcon } from '../../assets/icons/IconsSet';

import NavbarComponent from '../../components/layout/navbar/Navbar';
import ImageGallery from './imageGallery';

import { MotorcycleIcon } from '../../assets/icons/IconsSet';
import { useBatteryCartProvider } from '../../context/BatteryCartProvider';

import BatteryCartServices from '../../services/cart/BatteryCartServices';
import AddressServices from '../../services/address/AddressServices';

import { useAuthProvider } from '../../context/AuthProvider';
import { useGlobalDataProvider } from '../../context/GlobalDataProvider';


import './batteryPurchasePage.css';

function BatteryPurchasePage() {
    const location = useLocation();
    const batteryData = location.state;
    const [quantity, setQuantity] = useState(1);
    const { addBattery } = BatteryCartServices();
    const { batteryCart, setBatteryCart } = useBatteryCartProvider();
    const [formCEP, setFormCEP] = useState('');
    const { getFreight, getAddressCep } = AddressServices();
    const { isLoggedIn } = useAuthProvider();
    const [freightValues, setFreightValues] = useState({});
    const [prevFormCEP, setPrevFormCEP] = useState({})
    const [addressValues, setAddressValues] = useState({})
    const { fetchAddress, address } = useGlobalDataProvider();
    const [showSelectedAddressModal, setShowSelectedAddressModal] = useState(false);

    useEffect(() => {
        console.log(address);
        const fetchAddressData = async () => {
            await fetchAddress();
        };
        if (Object.keys(address).length === 0) {
            fetchAddressData();
        } else {
            const mainAddress = address.find(addr => addr.main === true);
            console.log('mainAddress', mainAddress)

            if (mainAddress) {
                handleGetFreightByCep(mainAddress.cep,
                    {
                        logradouro: mainAddress.address,
                        cep: mainAddress.cep,
                        cidade: mainAddress.city,
                        complemento: mainAddress.complement,
                        bairro: mainAddress.neighborhood,
                        numero: mainAddress.number,
                        estado: mainAddress.state
                    }
                );
            }
        }
    }, [address]);


    const handleAddBatteryToCart = async () => {
        if (isLoggedIn && batteryCart) {
            await addBatteryToServerCart();
        } else {
            addBatteryToLocalCart();
        }
    }

    const addBatteryToServerCart = async () => {
        const response = await addBattery(batteryCart.cartId, batteryData.batteryId, quantity);
        console.log('response', response);
        setBatteryCart(response);
    }

    const addBatteryToLocalCart = () => {
        let batteriesAddCart = [];
        let totalPrice = 0;

        const storedCart = localStorage.getItem('batteryCart');

        if (storedCart) {
            const cartData = JSON.parse(storedCart);
            totalPrice = cartData.totalPrice + (batteryData.value * quantity);
            batteriesAddCart = cartData.batteries;

            if (batteriesAddCart.some(battery => battery.batteryId === batteryData.batteryId)) {
                batteriesAddCart.forEach(battery => {
                    if (battery.batteryId === batteryData.batteryId) {
                        battery.quantity += quantity;
                    }
                });
            } else {
                batteriesAddCart.push({
                    batteryId: batteryData.batteryId,
                    quantity: quantity
                });
            }
        } else {
            totalPrice = batteryData.value * quantity;
            batteriesAddCart.push({
                batteryId: batteryData.batteryId,
                quantity: quantity
            });
        }

        const newItem = {
            totalPrice: totalPrice,
            batteries: batteriesAddCart
        };

        localStorage.setItem('batteryCart', JSON.stringify(newItem));
    }

    const handleGetAddressByCep = async (e, formCEP, requestModal) => {
        e.preventDefault();

        if (formCEP != prevFormCEP) {
            const response = await getAddressCep(formCEP);
            if (response) {
                setPrevFormCEP(formCEP);
                handleGetFreightByCep(formCEP, response);

                if (requestModal) {
                    setShowSelectedAddressModal(false)
                }
            }
        }
    }

    const handleGetFreightByCep = async (formCEP, addressValues, requestModal) => {
        const response = await getFreight(formCEP);
        if (response) {
            setFreightValues(response);
            setAddressValues(addressValues);

            if (requestModal) {
                setShowSelectedAddressModal(false)
            }
        }
    }


    const renderFreightCards = () => {
        return (
            <Card >
                <Card.Header type='button' className='small px-2 text-decoration-underline' onClick={() => setShowSelectedAddressModal(true)} >
                    <MapIcon size={'15px'} /> {addressValues.logradouro}, {addressValues.bairro}
                </Card.Header>
                <Card.Body className='card-body-freight pt-1'>
                    {freightValues.map((freight, index) => (
                        <div key={index} className={`${index > 0 ? 'mt-2 pt-1' : ''}`}>
                            {freight.discountPercentage > 0 && (
                                <span className='text-muted small'>
                                    Frete: <del>R${freight.defaultValue.toFixed(2)}</del><sup style={{ fontSize: '0.7em' }}>{freight.discountPercentage}%</sup>  <span className='text-success'>R${freight.contractValue.toFixed(2)}</span> ({freight.providerMethod})
                                </span>
                            )}
                            {freight.discountPercentage === 0 && (
                                <span className='text-muted small'>
                                    Frete: R${freight.defaultValue.toFixed(2)} ({freight.providerMethod})
                                </span>
                            )}
                            <br />
                            <span className='text-muted small'><DeliveryIcon size={'18px'} /> Você receberá em até {freight.estimateDays} dia{freight.estimateDays > 1 && 's'}</span>
                            <hr className='mb-0' />
                        </div>
                    ))}
                </Card.Body>
            </Card>
        );
    }

    return (
        <>
            <NavbarComponent setNavbarContent={true} />
            <Container fluid={'xl'} className="purchase-container py-lg-4" >
                <Card className="border-0 shadow " >
                    <Card.Body>
                        <Row className="d-flex">
                            <Col className='col-auto'>
                                <ImageGallery />
                            </Col>

                            <Col className='purchase-col-info mt-md-0 mt-4'>
                                <div>
                                    <h4>{batteryData.name}</h4>
                                    <p className="text-muted">{batteryData.description}</p>
                                </div>
                            </Col>

                            <Col className='col-12 col-md-auto purchase-col-card'>
                                <CardBatteryPurchase
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                    batteryData={batteryData}
                                    freightValues={freightValues}
                                    formCEP={formCEP}
                                    setFormCEP={setFormCEP}
                                    handleAddBatteryToCart={handleAddBatteryToCart}
                                    handleGetAddressByCep={handleGetAddressByCep}
                                    renderFreightCards={renderFreightCards}
                                />
                            </Col>
                        </Row>


                    </Card.Body>
                </Card>
            </Container >

            <ModalAddressBatteryPurchase
                address={address}
                setShowSelectedAddressModal={setShowSelectedAddressModal}
                showSelectedAddressModal={showSelectedAddressModal}
                handleGetFreightByCep={handleGetFreightByCep}
                formCEP={formCEP}
                setFormCEP={setFormCEP}
                handleGetAddressByCep={handleGetAddressByCep}
            />
        </>
    );

}


function CardBatteryPurchase(props) {

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

                <section>
                    {props.freightValues.length > 0 && (
                        <>{props.renderFreightCards()}</>
                    )}
                </section>

                <div className='h-100 d-flex flex-column justify-content-between'>

                    {Object.keys(props.freightValues).length === 0 && (
                        <section>
                            <span>Calcular frete</span>
                            <Form className='d-flex align-items-center'>
                                <InputGroup className='flex-nowrap'>
                                    <FormGroupWithIcon
                                        icon={<MapIcon className='position-absolute ms-3' currentColor='#333' />}
                                        type={'text'}
                                        placeholder={'Digite o CEP'}
                                        value={props.formCEP}
                                        onChange={(e) => props.setFormCEP(e.target.value)}
                                    />
                                    <Button variant="red" onClick={(e) => props.handleGetAddressByCep(e, props.formCEP)}>ok</Button>
                                </InputGroup>
                            </Form>
                        </section>
                    )
                    }

                    <section className='mb-3 pb-1 mt-3'>
                        <div className='lh-sm mb-3'>
                            <h6 className='fw-bold mb-0'>Estoque disponível</h6>
                            <span>disponível: <span className='fw-bold'> {props.batteryData.quantity} unidades</span></span>
                        </div>

                        <Card className="d-flex">
                            <Row className='g-0'>
                                <Col className='col-auto'>
                                    <Button variant="primary fw-bold rounded-end-0 px-3 " onClick={() => props.setQuantity(prevQuantity => Math.max(1, prevQuantity - 1))}>-</Button>
                                </Col>
                                <Col className='d-flex align-items-center'>
                                    <FormControl
                                        type="text"
                                        className="flex-grow-0 text-center py-1 border-0"
                                        value={props.quantity}
                                        onChange={(e) => {
                                            let value = Number(e.target.value);
                                            if (isNaN(value) || value < 1) {
                                                value = 1;
                                            }
                                            props.setQuantity(Math.min(props.batteryData.quantity, value));
                                        }}
                                    />
                                </Col>
                                <Col className='col-auto'>
                                    <Button variant="primary fw-bold rounded-start-0 px-3 " onClick={() => props.setQuantity(prevQuantity => Math.min(props.batteryData.quantity, prevQuantity + 1))}>+</Button>
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



function ModalAddressBatteryPurchase(props) {

    const RenderLoggedAddressContent = () => (
        <>
            {props.address.map((address, index) => (
                <Card key={index}
                    className={`${index > 0 ? 'mt-2' : ''} card-modal-select-address`}
                    onClick={() =>
                        props.handleGetFreightByCep(address.cep,
                            {
                                logradouro: address.address,
                                cep: address.cep,
                                cidade: address.city,
                                complemento: address.complement,
                                bairro: address.neighborhood,
                                numero: address.number,
                                estado: address.state
                            },
                            true
                        )
                    } >
                    <Card.Body>
                        <Row>
                            <Col>
                                <h6 className='text-muted fw-bold mb-0'>{address.address}, {address.number},{address?.complement}</h6>
                                <span>{address.neighborhood}, {address.city}-{address.uf}, CEP {address.cep} </span>
                            </Col>

                            <Col className='col-auto d-flex align-items-center color-red'>
                                <MapIcon size={'30px'} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))
            }
        </>
    );



    return (
        <Modal show={props.showSelectedAddressModal} onHide={() => props.setShowSelectedAddressModal(false)} centered>
            <Modal.Header closeButton className='text-dark text-muted  d-flex justify-content-center'>
                <Modal.Title className='' >
                    Calcular valor do Frete
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className='px-3 px-md-5 py-4'>
                <section>
                    <Form className='d-flex align-items-center'>
                        <Form.Label className='text-muted fw-bold w-100 '>
                            Digite um CEP
                            <FormGroupWithIcon
                                icon={<MapIcon className='position-absolute ms-3' currentColor='#333' />}
                                type={'text'}
                                placeholder={'__-___-___'}
                                value={props.formCEP}
                                onChange={(e) => props.setFormCEP(e.target.value)}
                            />
                        </Form.Label>
                        <Button variant='red ms-2 mt-3'
                            onClick={(e) => {
                                props.handleGetAddressByCep(e, props.formCEP, true);
                            }}>Consultar</Button>
                    </Form>
                </section>

                <div className='mt-3'>
                    <span className='text-muted fw-bold'>Ou escolha um endereço cadastrado</span>
                    <RenderLoggedAddressContent />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default BatteryPurchasePage;
