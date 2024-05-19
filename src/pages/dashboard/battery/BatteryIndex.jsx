import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { AtomIcon, BarCode, DollarIcon, StockIcon, TextBodyIcon, PdfIcon } from '../../../assets/icons/IconsSet';
import AlertErrorOrSuccess from '../../../components/common/AlertErrorOrSuccess';
import BatteryCard from '../../../components/common/BatteryCard';
import ConfirmChangesModal from '../../../components/common/ConfirmChangesModal';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import Pagination from '../../../components/common/PaginationTable';
import SortButton from '../../../components/common/SortButton';
import BatteryServices from '../../../services/battery/BatteryServices';
import ModalPdf from '../../../services/pdf/Report'

function BatteryIndex({ batteries, setBatteries }) {
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [showBatteryFormModal, setShowBatteryFormModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [action, setAction] = useState('');
    const [disableFormControl, setDisableFormControl] = useState(false);
    const [showsModalPDF, setShowModalPDF] = useState(false);

    const [batteryValues, setBatteryValues] = useState({ name: '', description: '', value: '', quantity: '', code: '' });
    const [prevBatteryValues, setPrevBatteryValues] = useState({});
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});

    const formRef = useRef(null);
    const [successMessage, setSuccessMessage] = useState();
    const { createBattery, updateBattery, deleteBattery, reactiveBattery, errorMessages, setErrorMessages } = BatteryServices();


    useEffect(() => {
        if (!showBatteryFormModal) return;

        selectedBattery && selectedBattery.status === 'INACTIVE'
            ? setDisableFormControl(true)
            : setDisableFormControl(false)

        setErrorMessages({});
        setSuccessMessage('');
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

        const actionHandlers = {
            create: {
                handler: async () => {
                    const response = await createBattery(batteryValues);

                    if (response) {
                        setErrorMessages({})
                        const updatedBatteryValues = {};
                        Object.keys(batteryValues).forEach(key => {
                            updatedBatteryValues[key] = '';
                        });
                        setBatteryValues(updatedBatteryValues);
                        setSuccessMessage('Bateria Cadastrada com Sucesso!');
                        setBatteries([...batteries, response]);
                        console.log(successMessage)
                    }
                }
            },
            update: {
                handler: () => {
                    console.log(errorMessages)
                    setAction('update');
                    setConfirmChangesModalData({ title: 'Editar', message: 'Tem certeza que deseja editar os dados?' })
                    setPrevBatteryValues({});
                    setShowConfirmChangesModal(true);
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

        const isValid = action !== 'delete' && action !== 'reactive' ? formRef.current.reportValidity() && !isEquals(prevBatteryValues, batteryValues) : true;

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

        if (response) {
            const updatedBatteries = batteries.map(battery => {
                if (battery.batteryId === selectedBattery.batteryId) {
                    if (action === 'delete') {
                        setShowBatteryFormModal(false);
                        return { ...battery, status: 'INACTIVE' }
                    } else if (action === 'reactive') {
                        setSelectedBattery({ ...selectedBattery, status: 'ACTIVE' })
                        setDisableFormControl(false);
                        setSuccessMessage('Bateria Reativada Com Sucesso!');
                        return { ...battery, status: 'ACTIVE' };
                    } else {
                        setShowBatteryFormModal(false);
                        return { ...battery, ...batteryValues };
                    }
                }
                return battery;
            })

            setBatteries(updatedBatteries);
            setShowConfirmChangesModal(false);
            console.log(successMessage)
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

                            <AlertErrorOrSuccess errorMessages={errorMessages} successMessage={successMessage} />

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
                                            icon={<BarCode className='position-absolute ms-3 color-gray' />}
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
                                            icon={<DollarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
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
                                    <Form.Control type='file' accept='.png' multiple disabled={disableFormControl} />
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

            <ModalPdf setShowModalPDF={setShowModalPDF} showsModalPDF={showsModalPDF} currentItems={batteries} type={'battery'}/>
        </>
    )
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = batteries.slice(indexOfFirstItem, indexOfLastItem);
    const [activeField, setActiveField] = useState(null);

    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Baterias</h3>
                    <div className='d-flex ms-auto '>
                    <a type='button' className='btn btn-outline-danger' onClick={()=> setShowModalPDF(true)}><PdfIcon /></a>
                    
                        
                        <Button className='ms-3 btn btn-red bg-red border-0' onClick={() => {
                            setSelectedBattery('')
                            setShowBatteryFormModal(true);
                        }}>
                            Cadastrar Bateria
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover bordered >
                        <thead>
                            <tr className='border-2'>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Código
                                        <SortButton field="code" values={batteries} setValues={setBatteries} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Nome
                                        <SortButton field="name" values={batteries} setValues={setBatteries} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Descrição
                                        <SortButton field="description" values={batteries} setValues={setBatteries} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Preço
                                        <SortButton field="value" values={batteries} setValues={setBatteries} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Quantidade
                                        <SortButton field="quantity" values={batteries} setValues={setBatteries} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Situação
                                        <SortButton field="status" values={batteries} setValues={setBatteries} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                            </tr>
                        </thead>


                        <tbody>
                            {currentItems.map((battery) => (
                                <tr key={battery.batteryId} onDoubleClick={() => {
                                    setSelectedBattery(battery);
                                    const { batteryId, status, ...prevValues } = battery;
                                    setPrevBatteryValues(prevValues);
                                    setShowBatteryFormModal(true);
                                }}>
                                    <td className='table-cell-pointer'>{battery.code}</td>
                                    <td className='table-cell-pointer'>{battery.name}</td>
                                    <td className='table-cell-pointer'>{battery.description}</td>
                                    <td className='table-cell-pointer text-end'>{battery.value}</td>
                                    <td className='table-cell-pointer text-end'>{battery.quantity}</td>
                                    <td className='table-cell-pointer'>{battery.status == 'ACTIVE' ? 'Ativo' : 'Inativo'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination
                        totalItems={batteries.length}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </Card.Body>
            </Card>

            {renderBatteryFormModal()}
        </>
    );
}

export default BatteryIndex;