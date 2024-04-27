import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import FormGroupWithIcon from '../../components/common/FormGroupWithIcon';
import { AlertIcon, AtomIcon, TextBodyIcon, DolarIcon, StockIcon, BarCode, PercentIcon, FailDate } from '../../assets/icons/IconsSet';
import BatteryCard from '../../components/common/BatteryCard';


const AlertError = ({ errorMessages }) => (
    errorMessages.general ? (
        <div className={`msg alert ${errorMessages.general ? 'alert-danger' : 'alert-success'} mb-0 d-flex align-items-center mb-3`}>
            {errorMessages.success
                ? (<CheckIcon />)
                : (<AlertIcon size={"16"} currentColor={"#69282f"} />)
            }

            <span className='ms-2'>
                {errorMessages.general ? errorMessages.general : errorMessages.success}
            </span>
        </div>
    ) : null
);


export const RenderBatteryFormModal = ({ batteryValues, setBatteryValues, formRef, errorMessages }) => {
    return (
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
                <AlertError errorMessages={errorMessages} />
                <Form ref={formRef}>
                    <Form.Label className='w-100'>Nome do Produto</Form.Label>
                    <FormGroupWithIcon
                        icon={<AtomIcon className='position-absolute ms-3 color-gray' />}
                        type='text'
                        placeholder='Nome do Produto(Ex: Bateria123)'
                        mb={'mb-4'}
                        value={batteryValues.name}
                        onChange={(e) => setBatteryValues({ ...batteryValues, name: e.target.value })}
                        feedback={errorMessages.name}
                    />
                    <Form.Label className='w-100'>Descrição do Produto</Form.Label>
                    <FormGroupWithIcon
                        icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                        type='text'
                        placeholder='Descrição do produto(Ex: )'
                        mb={'mb-4'}
                        value={batteryValues.description}
                        onChange={(e) => setBatteryValues({ ...batteryValues, description: e.target.value })}
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
                                value={batteryValues.value}
                                onChange={(e) => setBatteryValues({ ...batteryValues, value: e.target.value })}
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
                                value={batteryValues.quantity}
                                onChange={(e) => setBatteryValues({ ...batteryValues, quantity: e.target.value })}
                                feedback={errorMessages.quantity}

                            />
                        </Form.Group>
                    </div>

                    <Form.Label >Imagens</Form.Label>
                    <Form.Control type='file' accept='.png' multiple />
                </Form>
            </Col>
        </Row>
    )
}


export const RenderPromotionFormModal = ({ promotionValues, setPromotionValues, formRef, error }) => {
    return (
        <Row>
            <Col>
                <alertError />
                <Form ref={formRef}>
                    <Form.Label className='w-100'>Código da Promoção</Form.Label>
                    <FormGroupWithIcon
                        icon={<BarCode className='position-absolute ms-3 color-gray' />}
                        type='text'
                        placeholder='Código da Promoção(Ex: cupom10)'
                        mb={'mb-4'}
                        value={promotionValues.code}
                        onChange={(e) => setPromotionValues({ ...promotionValues, code: e.target.value })}
                    />
                    <Form.Label className='w-100'>Porcentagem da Promoção</Form.Label>
                    <FormGroupWithIcon
                        icon={<PercentIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                        type='numbsetSelectedBatteryer'
                        placeholder='Porcentagem da Promoção(Ex: 10)'
                        mb={'mb-4'}
                        value={promotionValues.percentage}
                        onChange={(e) => setPromotionValues({ ...promotionValues, percentage: e.target.value })}
                    />
                    <Form.Label className='w-100'>Data Validade</Form.Label>
                    <FormGroupWithIcon
                        icon={<FailDate className='position-absolute ms-3' currentColor='#a3a29f' />}
                        type='text'
                        placeholder='Data Validade da Promoção (Ex: dd/MM/yyyy)'
                        mb={'mb-4'}
                        value={promotionValues.expirationDate}
                        onChange={(e) => setPromotionValues({ ...promotionValues, expirationDate: e.target.value })}
                    />
                </Form>
            </Col>
        </Row>
    )
}

export const RenderUserModal = ({ selectedUser }) => {

    return (
        <>
            <div className="my-3 ">
                <hr />
                <h6> <span className='fw-bold'>Nome do usuário: </span>{selectedUser.name}</h6>
                <h6> <span className='fw-bold'>Email: </span>{selectedUser.email}</h6>
                <h6> <span className='fw-bold'>Cargo: </span>{selectedUser.role}</h6>
                <hr />
            </div>

            <InputGroup hasValidation>
                <Form.Select className={`rounded-start`} >
                    <option hidden>Selecione o cargo que deseja...</option>
                    <option disabled value={selectedUser.role}>{selectedUser.role === 'ADMIN' ? 'Adiministrador' : 'Usuário'}</option>
                    {selectedUser.role === 'ADMIN'
                        ? (<option value="USER">Usuário</option>)
                        : (<option value="ADMIN">Adiministrador</option>)}

                </Form.Select>
            </InputGroup>
        </>
    )
}