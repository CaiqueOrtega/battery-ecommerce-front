import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { AtomIcon, BarCode, DollarIcon, StockIcon, TextBodyIcon, PdfIcon, EmptyBatteryIcon } from '../../../assets/icons/IconsSet';
import AlertErrorOrSuccess from '../../../components/common/AlertErrorOrSuccess';
import BatteryCard from '../../../components/common/BatteryCard';
import ConfirmChangesModal from '../../../components/common/ConfirmChangesModal';
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import Pagination from '../../../components/common/Pagination';
import SortButton from '../../../components/common/SortButton';
import BatteryServices from '../../../services/battery/BatteryServices';
import ModalPdf from '../../../services/pdf/Report'

function BatteryIndex({ batteries, setBatteries, batteriesIsLoaded }) {
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
                    }
                }
            },
            update: {
                handler: () => {
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
        } else {
            setShowConfirmChangesModal(false);
            setPrevBatteryValues(batteryValues);
        }
    };

    const isEquals = (prevBatteryValues, batteryValues) => {
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
                <Modal.Body className='px-4'>
                    <Row>
                        <Col xs={12} className='col-lg-auto d-flex justify-content-center'>
                            <BatteryCard
                                batteryName={batteryValues.name}
                                batteryDescription={batteryValues.description}
                                batteryPrice={batteryValues.value}
                                batteryQuantity={batteryValues.quantity}
                                onPlaceholder={false}
                                sizeWidth={'232px'}
                                sizeHeight={'434px'}
                                border={'border'}
                            />
                        </Col>
                        <Col className='px-4'>
                            <AlertErrorOrSuccess errorMessages={errorMessages} successMessage={successMessage} mb={'mb-3'}/>

                            <Form ref={formRef}>
                                <Row>
                                    <Col md={8}>
                                        <Form.Label className='w-100'>Nome do Produto</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                            type='text'
                                            placeholder='Nome do Produto(Ex: Bateria123)'
                                            value={batteryValues.name}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, name: e.target.value })}
                                            feedback={errorMessages.name}
                                            disable={disableFormControl}
                                        />
                                    </Col>

                                    <Col md={4}>
                                        <Form.Label className='w-100 '>Código</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<BarCode className='position-absolute ms-3 color-gray' />}
                                            type='text'
                                            placeholder='Código'
                                            value={batteryValues.code}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, code: e.target.value })}
                                            feedback={errorMessages.code}
                                            disable={disableFormControl}
                                        />
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label className='w-100 mt-2'>Descrição do Produto</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                            type='text'
                                            placeholder='Descrição do produto(Ex: )'
                                            value={batteryValues.description}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, description: e.target.value })}
                                            feedback={errorMessages.description}
                                            disable={disableFormControl}
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <Form.Label className='w-100 mt-2'>Preço</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<DollarIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                            type='text'
                                            placeholder='Preço do produto (Ex: R$ 00,00 )'
                                            value={batteryValues.value}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, value: e.target.value })}
                                            feedback={errorMessages.value}
                                            disable={disableFormControl}
                                        />
                                    </Col>

                                    <Col md={6}>
                                        <Form.Label className='w-100 mt-2'>Quantidade</Form.Label>
                                        <FormGroupWithIcon
                                            icon={<StockIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                            type='number'
                                            placeholder='Quantidade em estoque'
                                            value={batteryValues.quantity}
                                            onChange={(e) => setBatteryValues({ ...batteryValues, quantity: e.target.value })}
                                            feedback={errorMessages.quantity}
                                            disable={disableFormControl}
                                        />
                                    </Col>
                                    <Col className='mt-2'>
                                        <Form.Label >Imagens</Form.Label>
                                        <Form.Control type='file' accept='.png' multiple disabled={disableFormControl} />
                                    </Col>
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
                        <a type='button' className='btn btn-outline-danger' onClick={() => setShowModalPDF(true)}><PdfIcon /></a>
                        <Button className='ms-3 btn btn-red bg-red border-0' onClick={() => {
                            setSelectedBattery('')
                            setShowBatteryFormModal(true);
                        }}>
                            Cadastrar Bateria
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {batteries?.length > 0 ? (
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
                    ) : (
                        !batteriesIsLoaded ? (
                            <div className='h-100 d-flex flex-grow-1 align-items-center justify-content-center' >
                                <Spinner animation="border" role="status" style={{ color: '#c00d0d' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center py-5">
                                <EmptyBatteryIcon />
                                <span className="mt-2">Você ainda não tem nenhuma bateria adicionada!</span>
                                <span className="text-muted small">Adicione baterias para exibi-las</span>
                            </div>
                        )
                    )}

                    {batteriesIsLoaded && batteries.length > 0 && (
                        <Pagination
                            totalItems={batteries.length}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </Card.Body>
            </Card >

            {renderBatteryFormModal()}

            {
                showsModalPDF && (
                    <ModalPdf setShowModalPDF={setShowModalPDF} showsModalPDF={showsModalPDF} currentItems={batteries} type={'battery'} />
                )
            }

        </>
    );
}

export default BatteryIndex;