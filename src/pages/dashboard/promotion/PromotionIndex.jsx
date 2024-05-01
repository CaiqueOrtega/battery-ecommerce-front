import React, { useState, useRef, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Form, Button, ModalBody } from "react-bootstrap";
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import { BarCode, PercentIcon, FailDate } from '../../../assets/icons/IconsSet';
import PromotionService from "../../../services/promotion/PromotionService";
import ConfirmChanges from "../../../components/common/ConfirmChangesModal";
import AlertErrorOrSuccess from "../../../components/common/AlertErrorOrSuccess";

export default function PromotionIndex({ promotions }) {
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [showPromotionFormModal, setShowPromotionFormModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [action, setAction] = useState('');
    const [disableFormControl, setDisableFormControl] = useState(false);
    const [prevPromotionValues, setPrevPromotionValues] = useState({});
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});
    const [promotionValues, setPromotionValues] = useState({
        code: '',
        percentage: 0,
        expirationDate: ''
    });

    const formRef = useRef(null);
    const { updatePromotion, deletePromotion, createPromotion, reactivePromotion, setErrorMessages, errorMessages } = PromotionService()


    useEffect(() => {
        if (!showPromotionFormModal) return;

        selectedPromotion && selectedPromotion.status === 'INACTIVE'
            ? setDisableFormControl(true)
            : setDisableFormControl(false)

        setErrorMessages({});
        setPromotionValues({
            code: selectedPromotion.code || '',
            expirationDate: selectedPromotion.expirationDate || '',
            percentage: selectedPromotion.percentage || 0
        });
    }, [showPromotionFormModal]);



    const handleSubmit = async (e, action) => {
        e.preventDefault();

        const isValid = action !== 'delete' && action !== 'reactive' ? formRef.current.reportValidity() && !isEquals(prevPromotionValues, promotionValues) : true;

        const actionHandlers = {
            create: {
                handler: async () => {
                    const response = await createPromotion(promotionValues);

                    if (response) {
                        setErrorMessages({});
                        const updatedPromotionValues = {};
                        Object.keys(promotionValues).forEach(key => {
                            updatedPromotionValues[key] = '';
                        });
                        setPromotionValues(updatedPromotionValues);
                    }
                }
            },
            update: {
                handler: () => {
                    if (errorMessages.general || Object.keys(errorMessages).length === 0) {
                        setAction('update');
                        setConfirmChangesModalData({ title: 'Editar', message: 'Tem certeza que deseja editar os dados?' })
                        setPrevPromotionValues({});
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
        console.log(selectedPromotion);
        let response;
        if (action === 'update') {
            response = await updatePromotion(selectedPromotion.promotionId, promotionValues);
        } else if (action === 'delete') {
            response = await deletePromotion(selectedPromotion.promotionId);
        } else if (action === 'reactive') {
            response = await reactivePromotion(selectedPromotion.promotionId, promotionValues.expirationDate);
        }

        console.log(response);

        if (response) {
            setShowPromotionFormModal(false);
            setShowConfirmChangesModal(false);
        } else {
            setShowConfirmChangesModal(false);
            setPrevPromotionValues(promotionValues);
        }
    };

    const isEquals = (prevPromotionValues, promotionValues) => {
        console.log(prevPromotionValues)
        console.log(promotionValues)

        if (prevPromotionValues) {
            const keys = new Set([...Object.keys(prevPromotionValues), ...Object.keys(promotionValues)]);
            const isEqual = Array.from(keys).every(key => prevPromotionValues[key] === promotionValues[key]);

            if (isEqual) {
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados.'
                }));
            }
            setPrevPromotionValues(promotionValues);

            return isEqual;
        }
    };



    const renderPromotionFormModal = () => (
        <>
            <Modal show={showPromotionFormModal} onHide={() => setShowPromotionFormModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>{selectedPromotion ? 'Editar Promoção' : 'Cadastrar Promoção'}</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowPromotionFormModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                        <AlertErrorOrSuccess errorMessages={errorMessages}/>
                            <Form ref={formRef}>
                                <Form.Label className='w-100'>Código da Promoção</Form.Label>
                                <FormGroupWithIcon
                                    icon={<BarCode className='position-absolute ms-3 color-gray' />}
                                    type='text'
                                    placeholder='Código da Promoção(Ex: cupom10)'
                                    mb={'mb-4'}
                                    value={promotionValues.code}
                                    onChange={(e) => setPromotionValues({ ...promotionValues, code: e.target.value })}
                                    feedback={errorMessages.code}
                                    disable={disableFormControl}
                                />
                                <Form.Label className='w-100'>Porcentagem da Promoção</Form.Label>
                                <FormGroupWithIcon
                                    icon={<PercentIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                    type='number'
                                    placeholder='Porcentagem da Promoção(Ex: 10)'
                                    mb={'mb-4'}
                                    value={promotionValues.percentage}
                                    onChange={(e) => setPromotionValues({ ...promotionValues, percentage: e.target.value })}
                                    feedback={errorMessages.percentage}
                                    disable={disableFormControl}
                                />
                                <Form.Label className='w-100'>Data Validade</Form.Label>
                                <FormGroupWithIcon
                                    icon={<FailDate className='position-absolute ms-3' currentColor='#a3a29f' />}
                                    type='text'
                                    placeholder='Data Validade da Promoção (Ex: dd/MM/yyyy)'
                                    mb={'mb-4'}
                                    value={promotionValues.expirationDate}
                                    onChange={(e) => setPromotionValues({ ...promotionValues, expirationDate: e.target.value })}
                                    feedback={errorMessages.expirationDate}
                                />
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    {selectedPromotion && selectedPromotion.status === 'INACTIVE' && (
                        <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'reactive')}>
                            Reativar Promoção</Button>
                    )}

                    {selectedPromotion && selectedPromotion.status !== 'INACTIVE' && (
                        <>
                            <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'delete')}>
                                Desativar Promoção</Button>

                            <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'update')}>
                                Atualizar Promoção
                            </Button>
                        </>
                    )}

                    {!selectedPromotion && (
                        <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'create')}>
                            Cadastrar Promoção
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <ConfirmChanges
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
                    <h3 className='text-align-center mb-0'>Controle de Promoções</h3>
                    <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                        setSelectedPromotion('');
                        setShowPromotionFormModal(true);
                    }}>
                        Cadastrar Promoção
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover bordered>
                        <thead>
                            <tr>
                                <th className='bg-table-header'>Código</th>
                                <th className='bg-table-header'>Porcentagem</th>
                                <th className='bg-table-header'>Data início</th>
                                <th className='bg-table-header'>Data validade</th>
                                <th className="bg-table-header">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promotion) => (
                                <tr key={promotion.promotionId} onDoubleClick={() => {
                                    setSelectedPromotion(promotion);
                                    const { promotionId, status, startDate, ...prevValues } = promotion;
                                    setPrevPromotionValues(prevValues);
                                    setShowPromotionFormModal(true);
                                }}>
                                    <td>{promotion.code}</td>
                                    <td className='text-end'>{promotion.percentage}%</td>
                                    <td>{promotion.startDate}</td>
                                    <td>{promotion.expirationDate}</td>
                                    <td>{promotion.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {renderPromotionFormModal()}
        </>
    );
}