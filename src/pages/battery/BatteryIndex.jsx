import React, { useState, useContext, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, Container, Modal, Table, Card } from 'react-bootstrap';
import { AtomIcon, TextBodyIcon, DolarIcon, StockIcon } from '../../assets/icons/IconsSet';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import BatteryServices from '../../services/battery/BatteryServices';
import BatteryCard from '../../components/common/BatteryCard';
import ConfirmChanges from '../../components/common/ConfirmChangesModal';
import { BatteryContext } from '../../context/BatteryProvider';

function BatteryIndex() {
    const { batteries, setUpdateTable } = useContext(BatteryContext);
    const formRef = useRef(null);
    const [battetyValues, setBattetyValues] = useState({
        name: '',
        description: '',
        value: '',
        quantity: ''
    });
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [showBatteryFormModal, setShowBatteryFormModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [action, setAction] = useState('');
    const [errorMessages, setErrorMessages] = useState({});
    const [lastClickedBattery, setLastClickedBattery] = useState(null);
    const [clickTimeout, setClickTimeout] = useState(null);

    const { createBattery, updateBattery, deleteBattery } = BatteryServices();

    useEffect(() => {
        setErrorMessages({});
        if (selectedBattery) {
            setBattetyValues({
                name: selectedBattery.name || '',
                description: selectedBattery.description || '',
                value: selectedBattery.value || '',
                quantity: selectedBattery.quantity || ''
            });
        } else {
            setBattetyValues({
                name: '',
                description: '',
                value: '',
                quantity: ''
            });
        }
    }, [selectedBattery, showBatteryFormModal]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = formRef.current;

        if (form.reportValidity()) {
            const response = action === 'update'
                ? await updateBattery(selectedBattery?.batteryId, battetyValues.name, battetyValues.description, battetyValues.value, battetyValues.quantity)
                : await createBattery(battetyValues.name, battetyValues.description, battetyValues.value, battetyValues.quantity);
            if (response === 200 || response === 201) {
                setShowBatteryFormModal(false);
                setShowConfirmChangesModal(false);
                setUpdateTable(prevValue => !prevValue);
            }
        }
    };

    const handleConfirmChangesModal = async () => {
        if (errorMessages) {
            setShowConfirmChangesModal(false);
        }
        const response = action === 'update'
            ? await updateBattery(selectedBattery?.batteryId, battetyValues.name, battetyValues.description, battetyValues.value, battetyValues.quantity)
            : await deleteBattery(selectedBattery?.batteryId);
        if (response === 200 || response === 201) {
            setShowBatteryFormModal(false);
            setShowConfirmChangesModal(false);
        }
    };

    const handleRowClick = (battery) => {
        if (lastClickedBattery === battery) {
            setSelectedBattery(battery);
            setShowBatteryFormModal(true);
            setAction('update');
            clearTimeout(clickTimeout);
            setLastClickedBattery(null);
        } else {
            setLastClickedBattery(battery);
            const newClickTimeout = setTimeout(() => {
                setLastClickedBattery(null);
            }, 300);
            setClickTimeout(newClickTimeout);
        }
    };

    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Baterias</h3>
                    <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                        setShowBatteryFormModal(true);
                        setAction('create');
                    }}>
                        Cadastrar Bateria
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover bordered>
                        <thead>
                            <tr>
                                <th className='bg-table-header'>Nome</th>
                                <th className='bg-table-header'>Descrição</th>
                                <th className='bg-table-header'>Preço</th>
                                <th className='bg-table-header'>Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {batteries.map((battery) => (
                                <tr key={battery.batteryId} onClick={() => handleRowClick(battery)}>
                                    <td>{battery.name}</td>
                                    <td>{battery.description}</td>
                                    <td className='text-end'>{battery.value}</td>
                                    <td className='text-end'>{battery.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal size="lg" show={showBatteryFormModal} onHide={() => setShowBatteryFormModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>{action === 'update' ? 'Editar Produto' : 'Cadastrar Produto'}</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowBatteryFormModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} className='col-lg-auto d-flex justify-content-center'>
                            <BatteryCard
                                productName={battetyValues.name}
                                productDescription={battetyValues.description}
                                productPrice={battetyValues.value}
                                productQuantity={battetyValues.quantity}
                            />
                        </Col>
                        <Col>
                            <Form ref={formRef}>
                                <Form.Label className='w-100'>Nome do Produto</Form.Label>
                                <FormGroupWithIcon
                                    icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                    type='text'
                                    placeholder='Nome do Produto(Ex: Bateria123)'
                                    mb={'mb-4'}
                                    value={battetyValues.name}
                                    onChange={(e) => setBattetyValues({ ...battetyValues, name: e.target.value })}
                                    feedback={errorMessages.name}
                                />
                                <Form.Label className='w-100'>Descrição do Produto</Form.Label>
                                <FormGroupWithIcon
                                    icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                    type='text'
                                    placeholder='Descrição do produto(Ex: )'
                                    mb={'mb-4'}
                                    value={battetyValues.description}
                                    onChange={(e) => setBattetyValues({ ...battetyValues, description: e.target.value })}
                                    feedback={errorMessages.description}
                                />
                                <div className='d-flex'>
                                    <Form.Group className='flex-grow-1'>
                                        <Form.Label className='w-100'>Preço</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                            type='text'
                                            placeholder='Preço do produto (Ex: R$ 00,00 )'
                                            mb={'mb-4'}
                                            value={battetyValues.value}
                                            onChange={(e) => setBattetyValues({ ...battetyValues, value: e.target.value })}
                                            feedback={errorMessages.value}
                                        />
                                    </Form.Group>
                                    <Form.Group className='ms-5 flex-grow-1'>
                                        <Form.Label className='w-100'>Quantidade</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<StockIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                            type='number'
                                            placeholder='Quantidade em estoque'
                                            mb={'mb-4'}
                                            value={battetyValues.quantity}
                                            onChange={(e) => setBattetyValues({ ...battetyValues, quantity: e.target.value })}
                                            feedback={errorMessages.quantity}
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
                    {action === 'update' && (
                        <Button variant='red' className='float-end' onClick={() => {
                            setShowConfirmChangesModal(true);
                            setAction('delete');
                        }}>Deletar Produto</Button>
                    )}
                    <Button className='float-end' variant='red' onClick={handleFormSubmit}>
                        {action === 'update' ? 'Atualizar Produto' : 'Cadastrar Produto'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ConfirmChanges
                showConfirmChangesModal={showConfirmChangesModal}
                setShowConfirmChangesModal={setShowConfirmChangesModal}
                action={action}
                handleConfirmChanges={handleConfirmChangesModal}
                setUpdateTable={setUpdateTable}
            />
        </>
    );
}

export default BatteryIndex;
