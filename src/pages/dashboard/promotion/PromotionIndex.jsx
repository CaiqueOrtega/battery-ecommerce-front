import React, { useContext, useState, useRef, useEffect } from "react";
import { Card, Table, Modal, Row, Col, Form, Button } from "react-bootstrap";
import { DashBoardContext } from "../../../context/DashBoardProvider";
import FormGroupWithIcon from '../../../components/common/FormGroupWithIcon';
import { BarCode, CheckIcon, PercentIcon, FailDate, AlertIcon } from '../../../assets/icons/IconsSet';
import PromotionService from "../../../services/promotion/PromotionService";
import CheckConditions from '../../../services/dashboard/DashboardServices';

export default function PromotionIndex() {
    const { promotions, setUpdateTable } = useContext(DashBoardContext)
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [showPromotionFormModal, setShowPromotionFormModal] = useState(false);
    const [promotionValues, setPromotionsValues] = useState({
        code: '',
        percentage: 0,
        expirationDate: ''
    });
    const [prevPromotionValues, setPrevPromotionValues] = useState({});


    const { errorMessages, setErrorMessages, updatePromotion, deletePromotion, createPromotion, reactivePromotion } = PromotionService();


    const { formRef, handleSubmit, renderConfirmChangesModal } = CheckConditions(
        promotionValues, setPromotionsValues,
        prevPromotionValues, setPrevPromotionValues,
        showPromotionFormModal, setShowPromotionFormModal,
        selectedPromotion,
        errorMessages, setErrorMessages,
        createPromotion, updatePromotion, deletePromotion
    );


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
                                    type='numbsetSelectedBatteryer'
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

                    {!selectedPromotion && Object.keys(selectedPromotion).length == 0 ?(
                        <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'create')}>
                            Cadastrar Promoção
                        </Button>
                    ):null }

                    {/* Botão para reativar promoção */}
                    {selectedPromotion && selectedPromotion.status === 'INACTIVE' && (
                        <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'reactivate')}>
                            Reativar Promoção
                        </Button>
                    )}

                    {/* Botão para atualizar promoção */}
                    {selectedPromotion && selectedPromotion.status === 'ACTIVE' && (
                        <Button className='float-end' variant='red' onClick={(e) => handleSubmit(e, 'update')}>
                            Atualizar Promoção
                        </Button>
                    )}

                    {/* Botão para excluir promoção */}
                    {selectedPromotion && (
                        <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'delete')}>
                            Desativar Promoção
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Promoções</h3>
                    <Button className='ms-auto btn btn-red bg-red border-0' onClick={() => {
                        setShowPromotionFormModal(true);
                        setSelectedPromotion({})
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
                                    const { promotionId, status, ...prevValues } = promotion;
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
            {renderConfirmChangesModal()}
        </>
    );
}