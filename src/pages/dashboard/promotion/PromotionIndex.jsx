import React, { useContext, useState, useRef, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Form, Button, ModalBody } from "react-bootstrap";
import { PromotionContext } from "../../../context/PromotionProvider";
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import { AtomIcon, TextBodyIcon, DolarIcon, StockIcon, CheckIcon } from '../../../assets/icons/IconsSet';
import PromotionService from "../../../services/promotion/PromotionService";
import ConfirmChanges from "../../../components/common/ConfirmChangesModal";

export default function PromotionIndex() {
    const { promotions, setUpdateTable } = useContext(PromotionContext)
    const [selectedPromotion, setSelectedPromotion] = useState(null);

    const [showPromotionFormModal, setShowPromotionFormModal] = useState(false);
    const [showReactiveModal, setShowReactiveModal] = useState(false)
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const [verifyRequest, setVerifyRequest] = useState(false);
    const [request, setRequest] = useState('');
    const [action, setAction] = useState('');

    const [promotionValues, setPromotionsValues] = useState({
        code: '',
        percentage: 0,
        expirationDate: ''
    });

    const formRef = useRef(null);
    const [successMessages, setSuccessMessages] = useState('');

    const [fieldChange, setFieldChange] = useState({});

    const { getPromotions, setErrorMessages, errorMessages, updatePromotion, deletePromotion, createPromotion, reactivePromotion } = PromotionService()

    useEffect(() => {
        setErrorMessages({});
        if (request === 'editPromotion') {
            setPromotionsValues({
                code: selectedPromotion.code || '',
                expirationDate: selectedPromotion.expirationDate || '',
                percentage: selectedPromotion.percentage || 0
            });
            setVerifyRequest(true);
        } else {
            setPromotionsValues({
                code: '',
                expirationDate: '',
                percentage: ''
            });
            setVerifyRequest(false);
            setSuccessMessages('');
        }
    }, [request, selectedPromotion, showPromotionFormModal]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const form = formRef.current;
        if (form.reportValidity()) {
            if (verifyRequest) {
                setAction('update');
                setShowConfirmChangesModal(true);
            } else {
                const response = await createPromotion(promotionValues);
                if (response === 200 || response === 201) {
                    setUpdateTable(prevValue => !prevValue);
                    setSuccessMessages('Promoção Cadastrada com Sucesso!');
                    setPromotionsValues({
                        code: '',
                        expirationDate: '',
                        percentage: ''
                    });
                }
            }
        }
    };

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

    const renderPromotionFormModal = () => {
        { if (!selectedPromotion) return null; }

        return (
            <>
                <Modal show={showPromotionFormModal} onHide={() => setShowPromotionFormModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                    <Modal.Header className='bg-red text-white'>
                        <Modal.Title>{verifyRequest ? 'Editar Promoção' : 'Cadastrar Promoção'}</Modal.Title>
                        <button className='btn-close btn-close-white' onClick={() => setShowPromotionFormModal(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
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
                                    <Form.Label className='w-100'>Código da Promoção</Form.Label>
                                    <FormGroupWithIcon
                                        icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                        type='text'
                                        placeholder='Código da Promoção(Ex: cupom10)'
                                        mb={'mb-4'}
                                        value={promotionValues.code}
                                        onChange={(e) => setPromotionsValues({ ...promotionValues, code: e.target.value })}
                                        feedback={errorMessages.code}
                                    />
                                    <Form.Label className='w-100'>Porcentagem da Promoção</Form.Label>
                                    <FormGroupWithIcon
                                        icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                        type='number'
                                        placeholder='Porcentagem da Promoção(Ex: 10)'
                                        mb={'mb-4'}
                                        value={promotionValues.percentage}
                                        onChange={(e) => setPromotionsValues({ ...promotionValues, percentage: e.target.value })}
                                        feedback={errorMessages.percentage}
                                    />
                                    <Form.Label className='w-100'>Data Validade</Form.Label>
                                    <FormGroupWithIcon
                                        icon={<StockIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
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

                        {verifyRequest && selectedPromotion.status == "ACTIVE" && (
                            <Button variant='red' className='float-end' onClick={() => {
                                setFieldChange({ fieldDeleted: selectedPromotion.code });
                                setShowConfirmChangesModal(true);
                                setAction('delete');
                            }}>Desativar Promoção</Button>
                        )}

                        {selectedPromotion.status == "ACTIVE" && (
                            <Button className='float-end' variant='red' onClick={handleFormSubmit}>
                                {verifyRequest ? 'Atualizar Promoção' : 'Cadastrar Promoção'}
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <Modal show={showReactiveModal} onHide={() => setShowReactiveModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }} centered>
                    <Modal.Header className='bg-red text-white'>
                        <Modal.Title>Reativar Promoção</Modal.Title>
                        <button className='btn-close btn-close-white' onClick={() => setShowReactiveModal(false)} />
                    </Modal.Header>
                    <Modal.Body>
                        Deseja realmente reativar a promoção: {selectedPromotion.code}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowReactiveModal(false)}>Fechar</Button>
                        <Button variant="red" onClick={async () => {
                            const response = await reactivePromotion(selectedPromotion?.promotionId, promotionValues)
                            setUpdateTable(prevValue => !prevValue);
                            response === 200 ? (setShowReactiveModal(false), setShowPromotionFormModal(false)) : null
                        }}>Confirmar</Button>
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
    }


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Promoções</h3>
                    <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                        setShowPromotionFormModal(true);
                        setRequest('create');
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
                                    setRequest('editPromotion');
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