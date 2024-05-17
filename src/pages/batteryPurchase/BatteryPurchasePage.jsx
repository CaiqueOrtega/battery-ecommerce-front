import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Container, Row, Col, Button, FormControl } from 'react-bootstrap';
import NavbarComponent from '../../components/layout/navbar/Navbar';
import ImageGallery from './imageGallery';
import './batteryPurchasePage.css';
import { MotocycleIcon } from '../../assets/icons/IconsSet';

function BatteryPurchasePage() {
    const location = useLocation();
    const batteryData = location.state;
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="vh-100">
            <NavbarComponent setNavbarContent={true} />

            <Container fluid={'lg'} className='py-5 h-100 p-0'>
                <Card className='border-0 shadow h-100 p-2 '>
                    <Card.Body>
                        <Row className="d-flex  h-100">

                            <Col md={8} className='d-flex'>
                                <ImageGallery />
                            </Col>




                            <Col md={4}>
                                <Card className='h-100 shadow-sm'>
                                    <Card.Header className='d-flex flex-column justify-content-center py-3' style={{ background: '#F5F5F5' }}>
                                        <div className="lh-1">
                                            <h4 className='mb-0'>R$ {batteryData.value}</h4>
                                            <span className='text-success'>Em 5x R$ {(batteryData.value / 5).toFixed(2)} sem juros</span>
                                        </div>
                                        <span className='mt-2 text-muted small'><MotocycleIcon /> Vendido por MacDavis Motos</span>
                                    </Card.Header>

                                    <Card.Body className='d-flex flex-column justify-content-between'>


                                        <div className='px-4'>
                                            <div className='lh-sm mb-3'>
                                                <h6 className='fw-bold mb-0'>Estoque disponível</h6>
                                                <span>disponível: <span className='fw-bold'> {batteryData.quantity} unidades</span></span>
                                            </div>
                                            <Card className="d-flex">
                                                <Row>
                                                    <Col className='col-auto'>
                                                        <Button variant="primary fw-bold rounded-end-0 px-3 " onClick={() => setQuantity(prevQuantity => Math.max(0, prevQuantity - 1))}>-</Button>
                                                    </Col>
                                                    <Col className='d-flex justify-content-center align-items-center'>
                                                    <FormControl
                                                            type="text"
                                                            className="flex-grow-0 text-center py-1 border-0"
                                                            value={quantity}
                                                            onChange={(e) => {
                                                                let value = Number(e.target.value);
                                                                if (isNaN(value) || value < 0) {
                                                                    value = 0;
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


                                        <div className='mt-auto'>
                                            <Button variant='yellow py-2 fw-bold w-100 mb-2'>Comprar</Button>
                                            <Button variant='outline-primary py-2 fw-bold w-100'>Adicionar ao Carrinho</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>


                    </Card.Body>
                </Card>
            </Container>
        </div>
    );

}


export default BatteryPurchasePage;
