import { Modal, Card, Row, Col, Button, Form } from "react-bootstrap";
import FormGroupWithIcon from "./FormGroupWithIcon";
import LoginSignUpButton from "./LoginSignUpButton";
import { MapIcon } from "../../assets/icons/IconsSet";

function ModalSelectedAddress(props) {

    const RenderLoggedAddressContent = () => (
        <>
            {props.isLoggedIn ? (
                <>
                    <span className='text-muted fw-bold'>Ou escolha um endereço cadastrado</span>
                    {
                        props.address.map((address, index) => (
                            <Card key={index}
                                className={`${index > 0 ? 'mt-2' : ''} card-modal-select-address shadow-sm d-flex flex-row `}
                                onClick={() =>
                                    props.handleGetFreightByCep(address.cep,
                                        {
                                            logradouro: address.address,
                                            cep: address.cep,
                                            cidade: address.city,
                                            complemento: address.complement,
                                            bairro: address.neighborhood,
                                            numero: address.number,
                                            estado: address.state
                                        },
                                        true,
                                        props.quantity
                                    )
                                } >
                                <Card.Header className="px-2 border rounded-0 rounded-start-2"></Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <h6 className='text-muted fw-bold mb-0'>{address.address}, {address.number},{address?.complement}</h6>
                                            <span>{address.neighborhood}, {address.city}-{address.uf}, CEP {address.cep} </span>
                                        </Col>

                                        <Col className='col-auto d-flex align-items-center color-red'>
                                            <MapIcon size={'30px'} />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))
                    }
                </>
            ) : (
                <Card className="shadow-sm d-flex flex-row mt-4">
                    <Card.Header className="px-2 border rounded-0 rounded-start-2"></Card.Header>
                    <Card.Body as={Row} className="justify-content-between">
                        <Col xs={9}>
                            <span className="text-muted">Visualize seus endereços ao fazer login ou se cadastrar.</span>

                            <div className="d-flex mt-3">
                                <LoginSignUpButton
                                    classNameBtnLogin="btn-yellow w-100 me-3"
                                    classNameBtnSignUp="btn-red-outline w-100" />
                            </div>
                        </Col>
                        <Col xs={3} className=' color-red d-flex align-items-center justify-content-center'>
                            <MapIcon size={'40px'} />
                        </Col>
                    </Card.Body>
                </Card>
            )}
        </>
    );

    return (
        <Modal show={props.showSelectedAddressModal} onHide={() => props.setShowSelectedAddressModal(false)} centered>
            <Modal.Header closeButton className=' text-white text-muted  d-flex justify-content-center'>
                <Modal.Title >
                    Calcular valor do Frete
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className='px-3 px-md-5 py-5'>
                <section>
                    <Form className="d-flex align-items-center" onSubmit={(e) => props.handleGetAddressByCep(e, props.formCEP, true)}>
                        <Form.Label className='text-muted fw-bold w-100 '>
                            Digite um CEP
                            <FormGroupWithIcon
                                icon={<MapIcon className="position-absolute ms-3" currentColor="#333" />}
                                type={"text"}
                                placeholder={'__-___-___'}
                                value={props.formCEP}
                                onChange={(e) => props.setFormCEP(e.target.value)}
                            />
                        </Form.Label>
                        <Button variant="red ms-2 mt-3" type="submit">Consultar</Button>
                    </Form>
                </section>

                <div className='mt-3'>
                    <RenderLoggedAddressContent />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalSelectedAddress;