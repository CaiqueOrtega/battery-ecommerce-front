import React, { useContext, useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, ModalFooter } from 'react-bootstrap';
import { DashBoardContext } from '../../context/DashBoardProvider';
import DashBoardTable from './DashBoardTable';
import RenderModalContent from './DashBoardModalContent';
import BatteryServices from '../../services/battery/BatteryServices';
import PromotionService from '../../services/promotion/PromotionService';
import UserService from '../../services/users/UsersServices';

function DashboardMainContent({ selectedOption }) {
    const { users, promotions, batteries, setUpdateContent } = useContext(DashBoardContext);
    const { createBattery, updateBattery, deleteBattery } = BatteryServices();
    const { createPromotion, updatePromotion, deletePromotion, reactivePromotion } = PromotionService();
    const { changeRole } = UserService();

    const [serviceRequests, setServiceRequests] = useState({});
    const [itemValues, setItemValues] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [prevItemValues, setPrevItemValues] = useState({});
    const [dataTable, setDataTable] = useState([]);
    const [columnNameTable, setColumnNameTable] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleRowDoubleClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const renderUsers = () => {
        setColumnNameTable(['Nome', 'Email', 'Permissão', 'Situação']);
        setItemValues({ name: '', email: '', role: '' });
        setServiceRequests({
            changeRole: changeRole
        });
        const mappedData = users.map(user => ({
            user: user.userId,
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

    const renderers = {
        'Usuários': {
            renderFunction: renderUsers,
        },
        'Promoções': {
            renderFunction: renderPromotions,
        },
        'Baterias': {
            renderFunction: renderBatteries,
        }
    };

    useEffect(() => {
        if (Object.keys(batteries).length !== 0 || Object.keys(users).length !== 0 || Object.keys(promotions).length !== 0) {
            if (selectedOption && renderers[selectedOption] && typeof renderers[selectedOption].renderFunction === 'function') {
                renderers[selectedOption].renderFunction();
            } else {
                setDataTable([]);
            }
        }
    }, [selectedOption, batteries, users, promotions]);


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de {selectedOption}</h3>
                    {selectedOption === 'Baterias' || selectedOption === 'Promoções' ? (
                        <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                            setSelectedItem({});
                            setShowModal(true);
                        }}>
                            Cadastrar {selectedOption}
                        </Button>
                    ) : null}
                </Card.Header>
                <Card.Body>
                    <DashBoardTable data={dataTable} columnName={columnNameTable} onRowDoubleClick={handleRowDoubleClick} />
                </Card.Body>
            </Card>

            <RenderModalContent itemValues={itemValues} setItemValues={setItemValues} prevItemValues={prevItemValues} setPrevItemValues={setPrevItemValues} selectedItem={selectedItem} showModal={showModal} setShowModal={setShowModal} serviceRequests={serviceRequests} selectedOption={selectedOption} />
        </>
    );
}

export default DashboardMainContent;
