import React, { useRef } from 'react';
import { Row, Col, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import { AlertIcon, AtomIcon, TextBodyIcon, DolarIcon, StockIcon, BarCode, PercentIcon, FailDate } from '../../assets/icons/IconsSet';
import { CommonDashboardServices, userDashBoardServices } from '../../services/dashboard/DashboardServices';
import BatteryCard from '../../components/common/BatteryCard';
import ErrorServices from '../../services/error/ErrorServices';

const AlertError = ({ errorMessages }) => (
    errorMessages.general && (
        <div className={`msg alert ${errorMessages.general ? 'alert-danger' : 'alert-success'} mb-0 d-flex align-items-center mb-3`}>
            {errorMessages.success
                ? (<CheckIcon />)
                : (<AlertIcon size={"16"} currentColor={"#69282f"} />)
            }

            <span className='ms-2'>
                {errorMessages.general ? errorMessages.general : errorMessages.success}
            </span>
        </div>
    )
);

function RenderModalContent({ itemValues, setItemValues, prevItemValues, setPrevItemValues, selectedItem, showModal, setShowModal, serviceRequests, selectedOption }) {
    const { errorMessages, setErrorMessages, handleAPIError } = ErrorServices();
    const formRef = useRef(null);



    const renderCommunActionModalFooter = () => {
        const { handleSubmit, renderConfirmChangesModal } = CommonDashboardServices(
            itemValues, setItemValues,
            prevItemValues, setPrevItemValues,
            showModal, setShowModal,
            selectedItem,
            serviceRequests,
            formRef,
            errorMessages, setErrorMessages, handleAPIError
        );

        if (selectedItem && selectedItem.status === 'INACTIVE') {
            return (
                <>
                    {renderConfirmChangesModal()}
                    <Button variant='red' className='float-end' onClick={(e) => handleSubmit(e, 'reactivate')}>
                        Reativar {selectedOption}
                    </Button>
                </>
            );
        } else if (selectedItem && selectedItem.status === 'ACTIVE') {
            return (
                <>
                    {renderConfirmChangesModal()}
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

    const renderUserActionModalFooter = () => {
        const { handleSubmit, renderConfirmChangesModal } = userDashBoardServices(
            setItemValues, setPrevItemValues, setShowModal, setErrorMessages, handleAPIError
        );

        return (
            <>
                {renderConfirmChangesModal()}
                <Button className='float-end' variant='red' onClick={(e) => { handleSubmit() }}>Atualizar Permissão</Button>
            </>
        )
    }

    const optionMap = {
        Baterias: {
            renderHTML: (
                <Row>
                    <Col xs={12} className='col-lg-auto d-flex justify-content-center'>
                        <BatteryCard
                            batteryName={itemValues.name}
                            batteryDescription={itemValues.description}
                            batteryPrice={itemValues.value}
                            batteryQuantity={itemValues.quantity}
                        />
                    </Col>
                    <Col>
                        <AlertError errorMessages={errorMessages} />
                        <Form ref={formRef}>
                            <Form.Label className='w-100'>Nome do Produto</Form.Label>
                            <FormGroupWithIcon
                                icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                                type='text'
                                placeholder='Nome do Produto(Ex: Bateria123)'
                                mb={'mb-4'}
                                value={itemValues.name}
                                onChange={(e) => setItemValues({ ...itemValues, name: e.target.value })}
                                feedback={errorMessages.name}
                            />
                            <Form.Label className='w-100'>Descrição do Produto</Form.Label>
                            <FormGroupWithIcon
                                icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type='text'
                                placeholder='Descrição do produto(Ex: )'
                                mb={'mb-4'}
                                value={itemValues.description}
                                onChange={(e) => setItemValues({ ...itemValues, description: e.target.value })}
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
                                        value={itemValues.value}
                                        onChange={(e) => setItemValues({ ...itemValues, value: e.target.value })}
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
                                        value={itemValues.quantity}
                                        onChange={(e) => setItemValues({ ...itemValues, quantity: e.target.value })}
                                        feedback={errorMessages.quantity}

                                    />
                                </Form.Group>
                            </div>

                            <Form.Label >Imagens</Form.Label>
                            <Form.Control type='file' accept='.png' multiple />
                        </Form>
                    </Col>
                </Row>
            ),
            modalFooterContent: renderCommunActionModalFooter
        },
        Promoções: {
            renderHTML: (
                <Row>
                    <Col>
                        <AlertError errorMessages={errorMessages} />
                        <Form ref={formRef}>
                            <Form.Label className='w-100'>Código da Promoção</Form.Label>
                            <FormGroupWithIcon
                                icon={<BarCode className='position-absolute ms-3 color-gray' />}
                                type='text'
                                placeholder='Código da Promoção(Ex: cupom10)'
                                mb={'mb-4'}
                                value={itemValues.code}
                                onChange={(e) => setItemValues({ ...itemValues, code: e.target.value })}
                                feedback={errorMessages.code}
                            />
                            <Form.Label className='w-100'>Porcentagem da Promoção</Form.Label>
                            <FormGroupWithIcon
                                icon={<PercentIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type='number'
                                placeholder='Porcentagem da Promoção(Ex: 10)'
                                mb={'mb-4'}
                                value={itemValues.percentage}
                                onChange={(e) => setItemValues({ ...itemValues, percentage: e.target.value })}
                                feedback={errorMessages.percentage}
                            />
                            <Form.Label className='w-100'>Data Validade</Form.Label>
                            <FormGroupWithIcon
                                mask={'99/99/9999'}
                                icon={<FailDate className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type='text'
                                placeholder='Data Validade da Promoção (Ex: dd/MM/yyyy)'
                                mb={'mb-4'}
                                value={itemValues.expirationDate}
                                onChange={(e) => setItemValues({ ...itemValues, expirationDate: e.target.value })}
                                feedback={errorMessages.expirationDate}
                            />
                        </Form>
                    </Col>
                </Row>
            ),
            modalFooterContent: renderCommunActionModalFooter
        },
        Usuários: {
            renderHTML: (
                <>
                     {console.log('se', selectedItem)}

                    {selectedItem && (
                        <>
                       
                            <AlertError errorMessages={errorMessages} />

                            <div className="my-3 ">
                                <hr />
                                <h6> <span className='fw-bold'>Nome do usuário: </span>{selectedItem.name}</h6>
                                <h6> <span className='fw-bold'>Email: </span>{selectedItem.email}</h6>
                                <h6> <span className='fw-bold'>Cargo: </span>{selectedItem.role}</h6>
                                <hr />
                            </div>

                            <InputGroup hasValidation>
                                <Form.Select className={`rounded-start`} value={itemValues.role} onChange={(e) => setItemValues(e.target.value)} >
                                    <option hidden>Selecione o cargo que deseja...</option>
                                    <option disabled value={selectedItem.role}>{selectedItem.role === 'ADMIN' ? 'Adiministrador' : 'Usuário'}</option>
                                    {selectedItem.role === 'ADMIN'
                                        ? (<option value="USER">Usuário</option>)
                                        : (<option value="ADMIN">Adiministrador</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" className="ms-1">
                                    <AlertIcon size="14" currentColor={"currentcolor"} /> {errorMessages ? errorMessages.role : null}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </>
                    )}
                </>
            ),

        }
    };

    const getHTMLContent = () => {
        const option = optionMap[selectedOption];
        return option ? option.renderHTML : null;
    };

    const getFooterContent = () => {
        const option = optionMap[selectedOption];
        if (selectedOption && optionMap[selectedOption] && typeof optionMap[selectedOption].modalFooterContent === 'function') {
            return option ? option.modalFooterContent() : null;
        }
    };

    const renderContent = getHTMLContent();
    const renderModalFooter = getFooterContent();



    return (
        <>
            <Modal size={`${selectedOption === 'Baterias' ? 'lg' : ''}`} show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
                <Modal.Header className='bg-red text-white'>
                    <Modal.Title>{selectedItem && Object.keys(selectedItem).length !== 0 ? 'Editar' : 'Cadastrar'}</Modal.Title>
                    <button className='btn-close btn-close-white' onClick={() => setShowModal(false)} />
                </Modal.Header>
                <Modal.Body>
                    {renderContent}
                </Modal.Body>
                <Modal.Footer>
                    {renderModalFooter}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RenderModalContent;
