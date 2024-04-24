import React, { useContext, useState, useRef, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Form, Button, ModalBody } from "react-bootstrap";
import { PromotionContext } from "../../../context/PromotionProvider";
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import { BarCode, CheckIcon, PercentIcon, FailDate } from '../../../assets/icons/IconsSet';
import PromotionService from "../../../services/promotion/PromotionService";
import ConfirmChanges from "../../../components/common/ConfirmChangesModal";

export default function PromotionIndex() {
    const { promotions, setUpdateTable } = useContext(PromotionContext)
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const [showPromotionFormModal, setShowPromotionFormModal] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [request, setRequest] = useState(false);
    const [action, setAction] = useState('');

    const [promotionValues, setPromotionsValues] = useState({
        code: '',
        percentage: 0,
        expirationDate: ''
    });

    const formRef = useRef(null);
    const [fieldChange, setFieldChange] = useState({});
    const { setErrorMessages, errorMessages, updatePromotion, deletePromotion, createPromotion, reactivePromotion } = PromotionService()

    useEffect(() => {
        setErrorMessages({});
        if (request) {
            setPromotionsValues({
                code: selectedPromotion.code || '',
                expirationDate: selectedPromotion.expirationDate || '',
                percentage: selectedPromotion.percentage || 0
            });

        } else {
            setPromotionsValues({
                code: '',
                expirationDate: '',
                percentage: ''
            });
        }
    }, [showPromotionFormModal]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = formRef.current;
        if (form.reportValidity()) {
            const response = await createPromotion(promotionValues);
            if (response.success) {
                setUpdateTable(prevValue => !prevValue);
                setPromotionsValues({
                    code: '',
                    expirationDate: '',
                    percentage: ''
                });
            }
        }
    }


    const handleConfirmChangesModal = async () => {
        if (errorMessages) {
            setShowConfirmChangesModal(false);
        }
        const response = action === 'update'
            ? await updatePromotion(selectedPromotion?.promotionId, promotionValues.code, promotionValues.expirationDate, promotionValues.percentage)
            : await deletePromotion(selectedPromotion?.code)
        if (response === 200 || response === 201) {
            setShowPromotionFormModal(false);
            setShowConfirmChangesModal(false);
            setUpdateTable(prevValue => !prevValue);
        }

    };

    const renderPromotionFormModal = () => (
        <>
            <Modal show={showPromotionFormModal} onHide={() => setShowPromotionFormModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>{request ? 'Editar Promoção' : 'Cadastrar Promoção'}</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowPromotionFormModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form ref={formRef}>
                                <Form.Label className='w-100'>Código da Promoção</Form.Label>
                                <FormGroupWithIcon
                                    icon={<BarCode className='position-absolute ms-3 color-gray' />}
                                    type='text'
                                    placeholder='Código da Promoção(Ex: cupom10)'
                                    mb={'mb-4'}
                                    value={promotionValues.code}
                                    onChange={(e) => setPromotionsValues({ ...promotionValues, code: e.target.value })}
                                    feedback={errorMessages.code}
                                />
                                <Form.Label className='w-100'>Porcentagem da Promoção</Form.Label>
                                <FormGroupWithIcon
                                    icon={<PercentIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                    type='number'
                                    placeholder='Porcentagem da Promoção(Ex: 10)'
                                    mb={'mb-4'}
                                    value={promotionValues.percentage}
                                    onChange={(e) => setPromotionsValues({ ...promotionValues, percentage: e.target.value })}
                                    feedback={errorMessages.percentage}
                                />
                                <Form.Label className='w-100'>Data Validade</Form.Label>
                                <FormGroupWithIcon
                                    icon={<FailDate className='position-absolute ms-3' currentColor='#a3a29f' />}
                                    type='text'
                                    placeholder='Data Validade da Promoção (Ex: dd/MM/yyyy)'
                                    mb={'mb-4'}
                                    value={promotionValues.expirationDate}
                                    onChange={(e) => setPromotionsValues({ ...promotionValues, expirationDate: e.target.value })}
                                    feedback={errorMessages.expirationDate}
                                />
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    {selectedPromotion && selectedPromotion.status == "INACTIVE" &&
                        <Button variant="red" className="float-end" onClick={() => {
                            setShowReactiveModal(true)
                        }}>
                            Reativar Promoção
                        </Button>
                    }

                    {selectedPromotion && request && selectedPromotion.status == "ACTIVE" && (
                        <Button variant='red' className='float-end' onClick={() => {
                            setFieldChange({ fieldDeleted: selectedPromotion.code });
                            setShowConfirmChangesModal(true);
                            setAction('delete');
                        }}>Desativar Promoção</Button>
                    )}

                    {selectedPromotion && selectedPromotion.status == "ACTIVE" && (
                        <Button className='float-end' variant='red' onClick={handleFormSubmit}>
                            {request ? 'Atualizar Promoção' : 'Cadastrar Promoção'}
                        </Button>
                    )}
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
                    <h3 className='text-align-center mb-0'>Controle de Promoções</h3>
                    <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                        setShowPromotionFormModal(true);
                        setRequest(false);
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
                                    setRequest(true);
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