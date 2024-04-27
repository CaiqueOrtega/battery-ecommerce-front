import React, { useContext, useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, ModalFooter } from 'react-bootstrap';
import { DashBoardContext } from '../../context/DashBoardProvider';
import DashBoardTable from './DashBoardTable';
import { RenderBatteryFormModal, RenderPromotionFormModal, RenderUserModal } from './DashBoardModalContent';
import DashboardServices from '../../services/dashboard/DashboardServices';
import BatteryServices from '../../services/battery/BatteryServices';
import PromotionService from '../../services/promotion/PromotionService';
import ErrorServices from '../../services/error/ErrorServices';

function DashboardMainContent({ selectedOption }) {
    const { users, promotions, batteries, setUpdateContent } = useContext(DashBoardContext);
    const { createBattery, updateBattery, deleteBattery } = BatteryServices();
    const { createPromotion, updatePromotion, deletePromotion, reactivePromotion } = PromotionService();
    const { errorMessages, setErrorMessages, handleAPIError } = ErrorServices();

    const [serviceRequests, setServiceRequests] = useState({});
    const [itemValues, setItemValues] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [prevItemValues, setPrevItemValues] = useState({});
    const [dataTable, setDataTable] = useState([]);
    const [columnNameTable, setColumnNameTable] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const formRef = useRef(null);

    const { handleSubmit, renderConfirmChangesModal } = DashboardServices(
        itemValues, setItemValues,
        prevItemValues, setPrevItemValues,
        showModal, setShowModal,
        selectedItem,
        serviceRequests,
        formRef,
        errorMessages, setErrorMessages, handleAPIError,
    );

    const handleRowDoubleClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };


    const renderUsers = () => {
        setColumnNameTable(['Nome', 'Email', 'Permissão', 'Situação']);
        const mappedData = users.map(user => ({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        }));
        setDataTable(mappedData);
    };

    
    const renderPromotions = () => {
        setColumnNameTable(['Código', 'Porcentagem', 'Data início', 'Data validade', 'Situação']);
        setItemValues({ code: '', percentage: 0, expirationDate: '' });
        setServiceRequests({
            createFunction: createPromotion,
            updateFunction: updatePromotion,
            deleteFunction: deletePromotion
        });
        const mappedData = promotions.map(promotion => ({
            promotionId: promotion.promotionId,
            code: promotion.code,
            percentage: promotion.percentage,
            startDate: promotion.startDate,
            expirationDate: promotion.expirationDate,
            status: promotion.status
        }));
        setDataTable(mappedData);
    };


    const renderBatteries = () => {
        setColumnNameTable(['Nome', 'Descrição', 'Preço', 'Quantidade', 'Status']);
        setItemValues({ name: '', description: '', value: '', quantity: '' });
        setServiceRequests({
            createFunction: createBattery,
            updateFunction: updateBattery,
            deleteFunction: deleteBattery
        });
        const mappedData = batteries.map(battery => ({
            batteryId: battery.batteryId,
            name: battery.name,
            description: battery.description,
            value: battery.value,
            quantity: battery.quantity,
            status: battery.status
        }));
        setDataTable(mappedData);
    };

    useEffect(() => {
        const renderDataFunctions = {
            'Usuários': renderUsers,
            'Promoções': renderPromotions,
            'Baterias': renderBatteries
        };

        if (renderDataFunctions[selectedOption]) {
            renderDataFunctions[selectedOption]();
        } else {
            setDataTable([]);
            setModalContent(null);
        }
    }, [ selectedOption ]);


    const renderModalContent = () => {
        switch (selectedOption) {
            case 'Usuários':
                return <RenderUserModal selectedUser={selectedItem} />;
            case 'Promoções':
                return <RenderPromotionFormModal promotionValues={itemValues} setPromotionValues={setItemValues} formRef={formRef} errorMessages={errorMessages} />;
            case 'Baterias':
                return <RenderBatteryFormModal batteryValues={itemValues} setBatteryValues={setItemValues} formRef={formRef} errorMessages={errorMessages} />;
            default:
                return null;
        }
    };

    const getActionModalFooter = () => {
        if (!selectedItem) return null;

        if (selectedItem.status === 'INACTIVE') {
            return (
                <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'reactivate')}>
                    Reativar {selectedOption}
                </Button>
            );
        } else if (selectedItem.status === 'ACTIVE') {
            return (
                <>
                    <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'delete')}>
                        Desativar {selectedOption}
                    </Button>
                    <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'update')}>
                        Atualizar {selectedOption}
                    </Button>
                </>
            );
        } else {
            return (
                <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'create')}>
                    Cadastrar {selectedOption}
                </Button>
            );
        }
    };

    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de {selectedOption}</h3>
                    {selectedOption === 'Baterias' && (
                        <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                            setSelectedItem({});
                            setShowModal(true);
                        }}>
                            Cadastrar Bateria
                        </Button>
                    )}
                </Card.Header>
                <Card.Body>
                    <DashBoardTable data={dataTable} columnName={columnNameTable} onRowDoubleClick={handleRowDoubleClick} />
                </Card.Body>
            </Card>

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>{selectedItem && Object.keys(selectedItem).length !== 0 ? 'Editar' : 'Cadastrar'}</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
                <ModalFooter>
                    {getActionModalFooter()}
                </ModalFooter>
            </Modal>

            {renderConfirmChangesModal()}
        </>
    );
}

export default DashboardMainContent;
