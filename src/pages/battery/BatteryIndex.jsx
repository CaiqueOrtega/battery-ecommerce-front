
import { Card, Form, Row, Col, Button, Container, Modal } from 'react-bootstrap';
import imagemExemploBateria from '../../assets/images/exemploImageRegister.png'
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import { EnvelopeIcon } from '../../assets/icons/IconsSet';
import { useState, useEffect } from 'react';
import BaterryServices from '../../services/battery/BatteryServices';

function BatteryIndex() {
    const { showBatteries } = BaterryServices()

    return (
        <>
            <BatteryNavBar />
            {showBatteries()}
        </>
    );
}


function BatteryNavBar() {
    const [show, setShow] = useState(false);

    return (
        <>
            <Container  className=' d-flex flex-row align-items-center'>


                <h3 className='text-muted text-align-center mb-0'>Controle de Baterias</h3>


                <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => setShow(true)}>
                    Cadastrar Bateria
                </Button>

                <BatteryRegisterForm show={show} setShow={setShow} />

            </Container>
            <hr />
        </>
    );
}

function BatteryRegisterForm({ show, setShow }) {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const { createBattery } = BaterryServices();
    return (
        <Modal size="lg" show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header className='bg-red text-white' >
                <Modal.Title>Cadastrar Produto</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShow(false)} />
            </Modal.Header>
            <Modal.Body>
                <Row className=''>
                    <Col xs={12} className='col-lg-auto d-flex justify-content-center'>
                        <BatteryCardRegisterExample
                            productName={productName}
                            productDescription={productDescription}
                            productPrice={productPrice}
                            productQuantity={productQuantity}
                        />
                    </Col>
                    <Col>
                        <Form>
                            <Form.Label>Nome do Produto</Form.Label>
                            <FormGroupWithIcon
                                icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='text' placeholder='Nome do Produto(Ex: Bateria123)' mb={'mb-4'}
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                            <Form.Label>Descrição do Produto</Form.Label>
                            <FormGroupWithIcon
                                icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                type='text' placeholder='Descrição do produto(Ex: )' mb={'mb-4'}
                                value={productDescription}
                                onChange={(e) => setProductDescription(e.target.value)}
                            />
                            <div className='d-flex'>
                                <Form.Group className='flex-grow-1'>
                                    <Form.Label>Preço</Form.Label>
                                    <FormGroupWithIcon
                                        icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                        type='text' placeholder='Preço do produto (Ex: R$ 00,00 )' mb={'mb-4'}
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className='ms-5 flex-grow-1'>
                                    <Form.Label>Quantidade</Form.Label>
                                    <FormGroupWithIcon
                                        icon={<EnvelopeIcon className='position-absolute ms-3' currentColor='a3a29f' />}
                                        type='number' placeholder='Quantidade em estoque' mb={'mb-4'}
                                        value={productQuantity}
                                        onChange={(e) => setProductQuantity(e.target.value)}
                                    />
                                </Form.Group>
                            </div>

                            <Form.Label >Imagens</Form.Label>
                            <Form.Control type='file' accept='.png' multiple />
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button className='float-end' variant='red' onClick={async (e) => {
                    e.preventDefault();
                    const response = await createBattery(productName, productDescription, productPrice, productQuantity)
                    if (response == 201) {
                        setShow(false)
                    }
                }}>Cadastrar Produto</Button>
            </Modal.Footer>
        </Modal>
    );
}

export function BatteryCardRegisterExample({ productName, productDescription, productPrice, productQuantity, onClick }) {
    return (
        <Card className='shadow rounded-3 me-2' style={{ maxWidth: '14rem' }} onClick={onClick}>
            <div className='p-3 rounded-3' style={{ background: "#fafafa" }}>
                <Card.Img className="img-fluid" variant="top" src={imagemExemploBateria} height={160} />
            </div>
            <Card.Body>
                <Card.Title as="h6" className='fw-'>{productName.trim() || 'Exemplo do Nome do Produto'}</Card.Title>
                <Card.Text className='text-muted mb-5 small'>
                    {productDescription.trim() || 'Exemplo da descrição do produto'}
                </Card.Text>
                <h5>R$ {productPrice || '00,00'}</h5>
            </Card.Body>
        </Card>
    );
}

export default BatteryIndex;