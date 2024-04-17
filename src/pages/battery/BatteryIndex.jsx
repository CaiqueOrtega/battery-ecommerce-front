
import { Form, Row, Col, Button, Container, Modal, Table, Card } from 'react-bootstrap';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import { EnvelopeIcon, TrashIcon } from '../../assets/icons/IconsSet';
import { useState, useContext, useEffect } from 'react';
import BatteryServices from '../../services/battery/BatteryServices';
import { BatteryContext } from '../../context/BatteryProvider';
import BatteryCard from '../../components/common/BatteryCard';

function BatteryIndex() {
    const [show, setShow] = useState(false);
    const { batteries } = useContext(BatteryContext);
    const [selectedBattery, setSelectedBattery] = useState('');
    const [request, setRequest] = useState('');

    return (
        <>

            <BatteryTable batteries={batteries} setShow={setShow} setSelectedBattery={setSelectedBattery} setRequest={setRequest} request={request} />

            <BatteryRegisterForm show={show} setShow={setShow} selectedBattery={selectedBattery} request={request} />
        </>
    );
}



function BatteryRegisterForm({ show, setShow, request, selectedBattery }) {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const verifyRequest = request === 'editBattery';

    useEffect(() => {
        setProductName(verifyRequest ? selectedBattery.name : '');
        setProductDescription(verifyRequest ? selectedBattery.description : '');
        setProductPrice(verifyRequest ? selectedBattery.value : '');
        setProductQuantity(verifyRequest ? selectedBattery.quantity : '');
    }, [request, selectedBattery]);




    const { createBattery, updateBattery, deleteBattery } = BatteryServices();

    return (
        <Modal size="lg" show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>{verifyRequest ? 'Editar Produto' : 'Cadastrar Produto'}</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShow(false)} />
            </Modal.Header>
            <Modal.Body>
                <Row className=''>
                    <Col xs={12} className='col-lg-auto d-flex justify-content-center'>
                        <BatteryCard
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
                {verifyRequest ? (
                    <Button variant='red' className='float-end' onClick={async (e) => {
                        const response = await deleteBattery(selectedBattery.batteryId);
                    }}>Deletar Produto</Button>
                ) : null}


                <Button className='float-end' variant='red' onClick={async (e) => {
                    e.preventDefault();

                    const response = verifyRequest
                        ? await updateBattery(selectedBattery.batteryId, productName, productDescription, productPrice, productQuantity)
                        : await createBattery(productName, productDescription, productPrice, productQuantity);

                    (response === 200 || response === 201) ? setShow(false) : null;

                }}>{verifyRequest ? 'Atualizar Produto' : 'Cadastrar Produto'}</Button>

            </Modal.Footer>
        </Modal>
    );
}


function BatteryTable({ batteries, setShow, setSelectedBattery, setRequest }) {
    const [lastClickedBattery, setLastClickedBattery] = useState(null);
    const [clickTimeout, setClickTimeout] = useState(null);

    const handleRowClick = (battery) => {
        if (lastClickedBattery === battery) {
            setSelectedBattery(battery);
            setRequest('editBattery');
            setShow(true);
            clearTimeout(clickTimeout);
            setLastClickedBattery(null);

        } else {
            setLastClickedBattery(battery);

            const newClickTimeout = setTimeout(() => {
                setLastClickedBattery(null);
            }, 300);

            setClickTimeout(newClickTimeout);
        }
    }

    return (
        <Card className='shadow rounded-3 mb-5'>
            <Card.Header className='py-3 d-flex'>
                <h3 className='text-align-center mb-0'>Controle de Baterias</h3>


                <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                    setShow(true);
                    setRequest('create')
                }}>
                    Cadastrar Bateria
                </Button>
            </Card.Header>
            <Card.Body>
                <Table responsive hover bordered>
                    <thead >
                        <tr >
                            <th className='bg-table-header'>Nome</th>
                            <th className='bg-table-header'>Descrição</th>
                            <th className='bg-table-header'>Preço</th>
                            <th className='bg-table-header'>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batteries.map(battery => (
                            <tr key={battery.batteryId} onClick={() => handleRowClick(battery)}>
                                <td>{battery.name}</td>
                                <td>{battery.description}</td>
                                <td>{battery.value}</td>
                                <td>{battery.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default BatteryIndex;