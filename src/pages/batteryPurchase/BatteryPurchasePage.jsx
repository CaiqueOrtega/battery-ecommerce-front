import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Row, Col, Button, FormControl, Form, InputGroup, Toast } from 'react-bootstrap';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import NavbarComponent from '../../components/layout/navbar/Navbar';
import ImageGallery from './imageGallery';
import './batteryPurchasePage.css';
import { MotorcycleIcon } from '../../assets/icons/IconsSet';
import BatteryCartServices from '../../services/cart/BatteryCartServices';
import { BatteryCartContext } from '../../context/BatteryCartProvider';
import AddressServices from '../../services/address/AddressServices';
import { AuthContext } from '../../context/AuthProvider';
import { MapIcon, DeliveryIcon } from '../../assets/icons/IconsSet';

function BatteryPurchasePage() {
    const location = useLocation();
    const batteryData = location.state;
    const [quantity, setQuantity] = useState(1);
    const { addBattery } = BatteryCartServices();
    const { batteryCart, setBatteryCart } = useContext(BatteryCartContext);
    const [formCEP, setFormCEP] = useState('');
    const { getFreight, getAddress } = AddressServices();
    const { isLoggedIn } = useContext(AuthContext);
    const [freightValues, setFreightValues] = useState({});
    const [prevFormCEP, setPrevFormCEP] = useState({})
    const [addressValues, setAddressValues] = useState({})

    const handleAddBattery = async () => {
        if (isLoggedIn && batteryCart) {
            const response = await addBattery(batteryCart.cartId, batteryData.batteryId, quantity)
            console.log('response', response)
            setBatteryCart(response)
        } else {
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
    }

    const handleFreight = async (e, formCEP) => {
        e.preventDefault();

        if (formCEP != prevFormCEP) {
            let response;
            response = await getAddress(formCEP);

            if (response) {
                setAddressValues(response);
                response = await getFreight(formCEP);
                setFreightValues(response);
                console.log('Freight value', freightValues)
                setPrevFormCEP(formCEP);
            }
        }
    }


    const renderFreightCards = () => {
        return (
            <Card >
                <Card.Header type='button' className='small px-2 text-decoration-underline' >
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
                                <Card className='card-value-purchase shadow-sm h-100'>
                                    <Card.Header className='d-flex flex-column justify-content-center py-3 mb-0' style={{ background: '#F5F5F5' }}>
                                        <div className="lh-1">
                                            <h4 className='mb-0'>R$ {batteryData.value}</h4>
                                            <span className='text-success'>Em 5x R$ {(batteryData.value / 5).toFixed(2)} sem juros</span>
                                        </div>
                                        <span className='mt-2 text-muted small'><MotorcycleIcon /> Vendido por MacDavis Motos</span>
                                    </Card.Header>

                                    <Card.Body className=' d-flex flex-column justify-content-between'>
                                       
                                        <section>
                                            {freightValues.length > 0 && (
                                                <>{renderFreightCards()}</>
                                            )}
                                        </section>

                                        <div className='px-4 h-100 d-flex flex-column justify-content-between'>

                                            <section className=''>
                                                {Object.keys(freightValues).length === 0 && (
                                                    <>
                                                        <span>Calcular frete</span>
                                                        <Form className='d-flex align-items-center'>
                                                            <InputGroup className='flex-nowrap'>
                                                                <FormGroupWithIcon
                                                                    icon={<MapIcon className='position-absolute ms-3' currentColor='#333' />}
                                                                    type={'text'}
                                                                    placeholder={'Digite o CEP'}
                                                                    value={formCEP}
                                                                    onChange={(e) => setFormCEP(e.target.value)}
                                                                />
                                                                <Button variant="red" onClick={(e) => handleFreight(e, formCEP)}>ok</Button>
                                                            </InputGroup>
                                                        </Form>
                                                    </>
                                                )}
                                            </section>

                                            <div className='mb-3 pb-1'>
                                                <div className='lh-sm mb-3'>
                                                    <h6 className='fw-bold mb-0'>Estoque disponível</h6>
                                                    <span>disponível: <span className='fw-bold'> {batteryData.quantity} unidades</span></span>
                                                </div>
                                                <Card className="d-flex">
                                                    <Row className='g-0'>
                                                        <Col className='col-auto'>
                                                            <Button variant="primary fw-bold rounded-end-0 px-3 " onClick={() => setQuantity(prevQuantity => Math.max(1, prevQuantity - 1))}>-</Button>
                                                        </Col>
                                                        <Col className='d-flex justify-content-center align-items-center'>
                                                            <FormControl
                                                                type="text"
                                                                className="flex-grow-0 text-center py-1 border-0"
                                                                value={quantity}
                                                                onChange={(e) => {
                                                                    let value = Number(e.target.value);
                                                                    if (isNaN(value) || value < 1) {
                                                                        value = 1;
                                                                    }
                                                                    setQuantity(Math.min(batteryData.quantity, value));
                                                                }}
                                                            />
                                                        </Col>
                                                        <Col className='col-auto'>
                                                            <Button variant="primary fw-bold rounded-start-0 px-3 " onClick={() => setQuantity(prevQuantity => Math.min(batteryData.quantity, prevQuantity + 1))}>+</Button>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </div>
                                        </div>

                                        <div>
                                            <Button variant='yellow py-2 fw-bold w-100 mb-2'>Comprar</Button>
                                            <Button variant='red-outline py-2 fw-bold w-100'
                                                onClick={() => handleAddBattery()}>
                                                Adicionar ao Carrinho
                                            </Button>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>


                    </Card.Body>
                </Card>
            </Container >
        </>
    );

}




export default BatteryPurchasePage;
