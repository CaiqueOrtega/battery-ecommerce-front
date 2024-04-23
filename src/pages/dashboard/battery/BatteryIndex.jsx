import { Form, Row, Col, Button, Modal, Table, Card } from 'react-bootstrap';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import { AtomIcon, TextBodyIcon, DolarIcon, StockIcon, CheckIcon } from '../../../assets/icons/IconsSet';
import { useState, useContext, useEffect, useRef } from 'react';
import BatteryServices from '../../../services/battery/BatteryServices';
import { BatteryContext } from '../../../context/BatteryProvider';
import BatteryCard from '../../../components/common/BatteryCard';
import ConfirmChanges from '../../../components/common/ConfirmChangesModal';

function BatteryIndex() {
    const { batteries, setUpdateTable } = useContext(BatteryContext);
    const [selectedBattery, setSelectedBattery] = useState(null);

    const [showBatteryFormModal, setShowBatteryFormModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [verifyRequest, setVerifyRequest] = useState(false);
    const [request, setRequest] = useState('');
    const [action, setAction] = useState('');
    const [fieldChange, setFieldChange] = useState({});

    const [batteryValues, setBatteryValues] = useState({
        name: '',
        description: '',
        value: '',
        quantity: ''
    });
    const formRef = useRef(null);
    const [successMessages, setSuccessMessages] = useState('');
    const { createBattery, updateBattery, deleteBattery, errorMessages, setErrorMessages } = BatteryServices();


    useEffect(() => {
        setErrorMessages({});
        if (request === 'editBattery') {
            setBatteryValues({
                name: selectedBattery.name || '',
                description: selectedBattery.description || '',
                value: selectedBattery.value || '',
                quantity: selectedBattery.quantity || 0
            });
            setVerifyRequest(true);
        } else {
            setBatteryValues({
                name: '',
                description: '',
                value: '',
                quantity: ''
            });
            setVerifyRequest(false);
            setSuccessMessages('');
        }
    }, [request, selectedBattery, showBatteryFormModal]);


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = formRef.current;
        if (form.reportValidity()) {
            if (verifyRequest) {
                setAction('update');
                setShowConfirmChangesModal(true);
            } else {
                const response = await createBattery(batteryValues.name, batteryValues.description, batteryValues.value, batteryValues.quantity);
                setUpdateTable(prevValue => !prevValue);
                if (response === 200 || response === 201) {
                    setSuccessMessages('Bateria Cadastrada com Sucesso!');
                    setBatteryValues({
                        name: '',
                        description: '',
                        value: '',
                        quantity: ''
                    });
                }
            }
        }
    };


    const handleConfirmChangesModal = async () => {
        if (errorMessages) {
            setShowConfirmChangesModal(false);
        }


        if (action === 'update') {
            const hasChanges =
                selectedBattery.naprevBatteryValues) => prevBatteryValues.name) ||
                selectedBattery.description !== ((prevBatteryValues) => prevBatteryValues.description) ||
                selectedBattery.value !== ((prevBatteryValues) => prevBatteryValues.value) ||
                selectedBattery.quantity !== ((prevBatteryValues) => prevBatteryValues.quantity);

            if (!hasChanges) {
                console.log('teste')
            } else {
                const response = await updateBattery(selectedBattery?.batteryId, batteryValues.name, batteryValues.description, batteryValues.value, batteryValues.quantity)
            }
        } else {
            const response = await deleteBattery(selectedBattery?.batteryId);
        }

        if (response === 200 || response === 201) {
            setShowBatteryFormModal(false);
            setShowConfirmChangesModal(false);
            setUpdateTable(prevValue => !prevValue);
        }

    };


    const renderBatteryFormModal = () => (
        <>
            <Modal size="lg" show={showBatteryFormModal} onHide={() => setShowBatteryFormModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>{verifyRequest ? 'Editar Produto' : 'Cadastrar Produto'}</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowBatteryFormModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={12} className='col-lg-auto d-flex justify-content-center'>
                            <BatteryCard
                                batteryName={batteryValues.name}
                                batteryDescription={batteryValues.description}
                                batteryPrice={batteryValues.value}
                                batteryQuantity={batteryValues.quantity}
                            />
                        </Col>
                        <Col>
                            {successMessages && (
                                <div className='msg alert alert-success mb-0 d-flex align-items-center mb-3'>
                                    <CheckIcon size={"16"} currentColor={"#1b4532"} />
                                    <span className='ms-2'>
                                        {successMessages}
                                    </span>
                                </div>
                            )
                            }

                            <Form ref={formRef}>
                                <Form.Label className='w-100'>Nome do Produto</Form.Label>
                                <FormGroupWithIcon
                                    icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                    type='text'
                                    placeholder='Nome do Produto(Ex: Bateria123)'
                                    mb={'mb-4'}
                                    value={batteryValues.name}
                                    onChange={(e) => setBatteryValues({ ...batteryValues, name: e.target.value })}
                                    feedback={errorMessages.name}
                                />
                                <Form.Label className='w-100'>Descrição do Produto</Form.Label>
                                <FormGroupWithIcon
                                    icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                    type='text'
                                    placeholder='Descrição do produto(Ex: )'
                                    mb={'mb-4'}
                                    value={batteryValues.description}
                                    onChange={(e) => setBatteryValues({ ...batteryValues, description: e.target.value })}
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
                                            value={batteryValues.value}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, value: e.target.value })}
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
                                            value={batteryValues.quantity}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, quantity: e.target.value })}
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
                    {verifyRequest && (
                        <Button variant='red' className='float-end' onClick={() => {
                            setFieldChange({ fieldDeleted: selectedBattery.name });
                            setShowConfirmChangesModal(true);
                            setAction('delete');
                        }}>Deletar Produto</Button>
                    )}

                    <Button className='float-end' variant='red' onClick={handleFormSubmit}>
                        {verifyRequest ? 'Atualizar Produto' : 'Cadastrar Produto'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ConfirmChanges
                showConfirmChangesModal={showConfirmChangesModal}
                setShowConfirmChangesModal={setShowConfirmChangesModal}
                action={action}
                handleConfirmChanges={handleConfirmChangesModal}
                setUpdateTable={setUpdateTable}
                field={fieldChange}
            />
        </>
    )

    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Baterias</h3>
                    <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                        setShowBatteryFormModal(true);
                        setRequest('create');
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
                                <tr key={battery.batteryId} onDoubleClick={() => {
                                    setSelectedBattery(battery);
                                    setRequest('editBattery');
                                    setShowBatteryFormModal(true);
                                }}>
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

            {renderBatteryFormModal()}
        </>
    );
}

export default BatteryIndex;