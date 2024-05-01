import { Form, Row, Col, Button, Modal, Table, Card } from 'react-bootstrap';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import { AtomIcon, TextBodyIcon, DolarIcon, StockIcon, CheckIcon, AlertIcon } from '../../../assets/icons/IconsSet';
import { useState, useEffect, useRef } from 'react';
import BatteryServices from '../../../services/battery/BatteryServices';
import BatteryCard from '../../../components/common/BatteryCard';
import ConfirmChangesModal from '../../../components/common/ConfirmChangesModal';

function BatteryIndex({ batteries }) {
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [showBatteryFormModal, setShowBatteryFormModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [action, setAction] = useState('');
    const [disableFormControl, setDisableFormControl] = useState(false);


    const [batteryValues, setBatteryValues] = useState({ name: '', description: '', value: '', quantity: '', code: '' });
    const [prevBatteryValues, setPrevBatteryValues] = useState({});
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});

    const formRef = useRef(null);
    const { createBattery, updateBattery, deleteBattery, reactiveBattery, errorMessages, setErrorMessages } = BatteryServices();


    useEffect(() => {
        if (!showBatteryFormModal) return;

        selectedBattery && selectedBattery.status === 'INACTIVE'
            ? setDisableFormControl(true)
            : setDisableFormControl(false)

        setErrorMessages({});
        setBatteryValues({
            name: selectedBattery.name || '',
            description: selectedBattery.description || '',
            value: selectedBattery.value || '',
            quantity: selectedBattery.quantity || '',
            code: selectedBattery.code || ''
        });
    }, [showBatteryFormModal]);



    const handleSubmit = async (e, action) => {
        e.preventDefault();
    
        const isValid = action !== 'delete' && action !== 'reactive' ? formRef.current.reportValidity() && !isEquals(prevBatteryValues, batteryValues) : true;
    
        const actionHandlers = {
            create: {
                handler: async () => {
                    const response = await createBattery(batteryValues);
                    const updatedBatteryValues = {};
    
                    if (response) {
                        Object.keys(batteryValues).forEach(key => {
                            updatedBatteryValues[key] = '';
                        });
                        setBatteryValues(updatedBatteryValues);
                    }
                }
            },
            update: {
                handler: () => {
                    if (errorMessages.general || Object.keys(errorMessages).length === 0) {
                        setAction('update');
                        setConfirmChangesModalData({ title: 'Editar', message: 'Tem certeza que deseja editar os dados?' })
                        setPrevBatteryValues({});
                        setShowConfirmChangesModal(true);
                    }
                }
            },
            delete: {
                handler: () => {
                    setAction('delete');
                    setShowConfirmChangesModal(true);
                    setConfirmChangesModalData({ title: 'Deletar', message: 'Deseja realmente deletar?' });
                }
            },
            reactive: {
                handler: () => {
                    setAction('reactive');
                    setShowConfirmChangesModal(true);
                    setConfirmChangesModalData({ title: 'Reativar Bateria', message: 'Deseja realmente Reativar a Bateria?' });
                }
            }
        };
    
        if (isValid) {
            await actionHandlers[action].handler();
        }
    };
    
        const handleConfirmChangesModal = async () => {
            let response;
            if (action === 'update') {
                response = await updateBattery(selectedBattery.batteryId, batteryValues);
            } else if (action === 'delete') {
                response = await deleteBattery(selectedBattery.batteryId);
            } else if (action === 'reactive') {
                response = await reactiveBattery(selectedBattery.batteryId);
            }

            console.log(response);

            if (response) {
                setShowBatteryFormModal(false);
                setShowConfirmChangesModal(false);
            } else {
                setShowConfirmChangesModal(false);
                setPrevBatteryValues(batteryValues);
            }
        };

        const isEquals = (prevBatteryValues, batteryValues) => {
            console.log(prevBatteryValues)
            console.log(batteryValues)

            if (prevBatteryValues) {
                const keys = new Set([...Object.keys(prevBatteryValues), ...Object.keys(batteryValues)]);
                const isEqual = Array.from(keys).every(key => prevBatteryValues[key] === batteryValues[key]);

                if (isEqual) {
                    setErrorMessages(prevErrors => ({
                        ...prevErrors, general: 'Os dados não foram alterados.'
                    }));
                }
                setPrevBatteryValues(batteryValues);

                return isEqual;
            }
        };

        const renderBatteryFormModal = () => (
            <>
                <Modal size="lg" show={showBatteryFormModal} onHide={() => setShowBatteryFormModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
                    <Modal.Header className='bg-red text-white'>
                        <Modal.Title>{selectedBattery ? 'Editar Produto' : 'Cadastrar Produto'}</Modal.Title>
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

                                {errorMessages.general || errorMessages.success ? (
                                    <div className={`msg alert ${errorMessages.general ? 'alert-danger' : 'alert-success'} mb-0 d-flex align-items-center mb-3`}>
                                        {errorMessages.success
                                            ? (<CheckIcon />)
                                            : (<AlertIcon size={"16"} currentColor={"#69282f"} />)
                                        }

                                        <span className='ms-2'>
                                            {errorMessages.general ? errorMessages.general : errorMessages.success}
                                        </span>
                                    </div>
                                ) : null}


                                <Form ref={formRef}>
                                    <Row>
                                        <Col md={8}>
                                            <Form.Label className='w-100'>Nome do Produto</Form.Label>
                                            <FormGroupWithIcon
                                                icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                                type='text'
                                                placeholder='Nome do Produto(Ex: Bateria123)'
                                                mb={'mb-4'}
                                                value={batteryValues.name}
                                                onChange={(e) => setBatteryValues({ ...batteryValues, name: e.target.value })}
                                                feedback={errorMessages.name}
                                                disable={disableFormControl}
                                            />
                                        </Col>

                                        <Col md={4}>
                                            <Form.Label className='w-100'>Código</Form.Label>
                                            <FormGroupWithIcon
                                                icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                                type='text'
                                                placeholder='Código'
                                                mb={'mb-4'}
                                                value={batteryValues.code}
                                                onChange={(e) => setBatteryValues({ ...batteryValues, code: e.target.value })}
                                                feedback={errorMessages.code}
                                                disable={disableFormControl}
                                            />
                                        </Col>

                                        <Col md={12}>
                                            <Form.Label className='w-100'>Descrição do Produto</Form.Label>
                                            <FormGroupWithIcon
                                                icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                                type='text'
                                                placeholder='Descrição do produto(Ex: )'
                                                mb={'mb-4'}
                                                value={batteryValues.description}
                                                onChange={(e) => setBatteryValues({ ...batteryValues, description: e.target.value })}
                                                feedback={errorMessages.description}
                                                disable={disableFormControl}
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <Form.Label className='w-100'>Preço</Form.Label>
                                            <FormGroupWithIcon
                                                icon={<DolarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                                type='text'
                                                placeholder='Preço do produto (Ex: R$ 00,00 )'
                                                mb={'mb-4'}
                                                value={batteryValues.value}
                                                onChange={(e) => setBatteryValues({ ...batteryValues, value: e.target.value })}
                                                feedback={errorMessages.value}
                                                disable={disableFormControl}
                                            />
                                        </Col>

                                        <Col md={6}>
                                            <Form.Label className='w-100'>Quantidade</Form.Label>
                                            <FormGroupWithIcon
                                                icon={<StockIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                                type='number'
                                                placeholder='Quantidade em estoque'
                                                mb={'mb-4'}
                                                value={batteryValues.quantity}
                                                onChange={(e) => setBatteryValues({ ...batteryValues, quantity: e.target.value })}
                                                feedback={errorMessages.quantity}
                                                disable={disableFormControl}
                                            />
                                        </Col>

                                        <Form.Label >Imagens</Form.Label>
                                        <Form.Control type='file' accept='.png' multiple disabled={disableFormControl}/>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>

                        {selectedBattery && selectedBattery.status === 'INACTIVE' && (
                            <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'reactive')}>
                                Reativar Bateria</Button>
                        )}

                        {selectedBattery && selectedBattery.status !== 'INACTIVE' && (
                            <>
                                <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'delete')}>
                                    Desativar Bateria</Button>

                                <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'update')}>
                                    Atualizar Bateria
                                </Button>
                            </>
                        )}

                        {!selectedBattery && (
                            <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'create')}>
                                Cadastrar Bateria
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <ConfirmChangesModal
                    showConfirmChangesModal={showConfirmChangesModal}
                    setShowConfirmChangesModal={setShowConfirmChangesModal}
                    handleConfirmChanges={handleConfirmChangesModal}
                    confirmChangesModalData={confirmChangesModalData}
                />
            </>
        )
        return (
            <>
                <Card className='shadow rounded-3 mb-5'>
                    <Card.Header className='py-3 d-flex'>
                        <h3 className='text-align-center mb-0'>Controle de Baterias</h3>
                        <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                            setSelectedBattery('')
                            setShowBatteryFormModal(true);
                        }}>
                            Cadastrar Bateria
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Table responsive hover bordered>
                            <thead>
                                <tr>
                                    <th className='bg-table-header'>Código</th>
                                    <th className='bg-table-header'>Nome</th>
                                    <th className='bg-table-header'>Descrição</th>
                                    <th className='bg-table-header'>Preço</th>
                                    <th className='bg-table-header'>Quantidade</th>
                                    <th className='bg-table-header'>Situação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batteries.map((battery) => (
                                    <tr key={battery.batteryId} onDoubleClick={() => {
                                        setSelectedBattery(battery);
                                        const { batteryId, status, ...prevValues } = battery;
                                        setPrevBatteryValues(prevValues);
                                        setShowBatteryFormModal(true);
                                    }}>
                                        <td>{battery.code}</td>
                                        <td>{battery.name}</td>
                                        <td>{battery.description}</td>
                                        <td className='text-end'>{battery.value}</td>
                                        <td className='text-end'>{battery.quantity}</td>
                                        <td className='text-end'>{battery.status}</td>
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