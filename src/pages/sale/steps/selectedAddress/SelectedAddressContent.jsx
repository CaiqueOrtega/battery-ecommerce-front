import { Card, Row, Col, Dropdown, Button, ModalFooter, ModalBody, CardHeader } from "react-bootstrap";
import { GeoFenceIcon, ReturnIcon, AddressMapIcon, ThreeDotsVerticalIcon } from "../../../../assets/icons/IconsSet";
import { useRef, useState } from "react";
import AddressServices from "../../../../services/address/AddressServices";
import FormValidations from "../../../../components/common/FormValidation";
import FormAddressRegister from "../../../../components/common/FormAddressRegister";
import ToastError from "../../../../components/ToastError";
import TruncateText from "../../../../components/common/TextCaractereLimited";

function SelectedAddressContent({ address, setAddress, addressValues, setAddressValues, userData, setSteps, showProgressBar, setShowProgressBar, setOptionsSelected, optionsSelected, handleNextStep }) {
    const [addressStepContent, setAddressStepContent] = useState(address.length > 0 ? 'renderAddress' : 'emptyAddress');
    const [selectedAddress, setSelectedAddress] = useState({});
    const [prevFormAddressValues, setPrevFormAddressValues] = useState({});
    const [action, setAction] = useState('');

    const handleSelectedAddress = (currentAddress) => {
        setSteps('payment');
        handleNextStep()
        setOptionsSelected({ ...optionsSelected, address: currentAddress })
    }

    const showContent = () => {
        switch (addressStepContent) {
            case 'emptyAddress':
                if (address?.length <= 0) {
                    return <RenderEmptyAddressContent
                        showProgressBar={showProgressBar}
                        setShowProgressBar={setShowProgressBar}
                        setAction={setAction}
                        setAddressStepContent={setAddressStepContent}
                    />
                }
            case 'formAddress':
                return <RenderAddressStepFormContent
                    selectedAddress={selectedAddress}
                    isUpdateId={selectedAddress?.addressId}
                    userId={userData.userId}
                    address={address}
                    setAddress={setAddress}
                    action={action}
                    handleSelectedAddress={handleSelectedAddress}
                    setAddressValues={setAddressValues}
                    addressValues={addressValues}
                    setAddressStepContent={setAddressStepContent}
                    prevFormAddressValues={prevFormAddressValues}
                    setPrevFormAddressValues={setPrevFormAddressValues}
                />
            case 'renderAddress':
                return <RenderSelectionAddressContent
                    addressValues={addressValues}
                    setAddressValues={setAddressValues}
                    address={address}
                    setAddressStepContent={setAddressStepContent}
                    setSelectedAddress={setSelectedAddress}
                    selectedAddress={selectedAddress}
                    handleSelectedAddress={handleSelectedAddress}
                    setAction={setAction}
                    setPrevFormAddressValues={setPrevFormAddressValues}
                />
            default:
                return <div>Funcionalidade não Encontrada...</div>;
        }
    };

    return (
        showContent()
    );
};

function RenderSelectionAddressContent({ addressValues, setAddressValues, address, setAddressStepContent, setSelectedAddress, handleSelectedAddress, setAction, setPrevFormAddressValues }) {

    const handleShowFormUpdate = (address) => {
        setAction('update');
        setSelectedAddress(address);
        const { selectedAddress, addressId, ...addressWithoutSelected } = address;
        setPrevFormAddressValues(addressWithoutSelected);
        setAddressStepContent('formAddress');
    }

    const handleShowFormCreate = () => {
        setAddressStepContent('formAddress');
        setAction('create');
    }

    const handleClickCard = (currentAddress) => {
        setAddressValues({ ...addressValues, isLoading: true })

        setTimeout(() => {
            setAddressValues({ ...currentAddress, selectedAddressCard: true, isLoading: false });
        }, 500);
    }

    return (
        <>
            <ModalBody className="py-3 overflow-auto">
                <section className="d-flex flex-column h-100 justify-content-center px-4">
                    <div className="mb-2">
                        <h4 className="text-muted">Confirmar endereço Selecionado</h4>
                        <p className="text-muted mb-0">Atualize o endereço de entrega para receber seus produtos no local desejado.</p>
                    </div>
                    <AddressCard
                        currentAddress={{ ...addressValues, selectedAddressCard: true }}
                        handleShowFormUpdate={handleShowFormUpdate}
                        setAddress={setAddressValues}
                        handleClickCard={handleClickCard}
                    />

                    <hr className="mb-4 mt-4" />

                    {address.length > 0 && address.some(addr => addr?.addressId !== addressValues?.addressId) && (
                        <>
                            <span className='text-muted fw-bold'>Ou escolha outro endereço cadastrado</span>
                            {address
                                .filter(addr => addr?.addressId !== addressValues?.addressId)
                                .map((addr, index) => (
                                    <AddressCard
                                        key={index}
                                        currentAddress={addr}
                                        handleShowFormUpdate={handleShowFormUpdate}
                                        handleClickCard={handleClickCard}
                                    />
                                ))}
                        </>
                    )}

                    {address?.length <= 2 && (
                        <Card className="shadow-sm card-modal-select-address shadow-sm d-flex flex-row mt-2">
                            <Card.Body className="py-3">
                                <Row>
                                    <Col className='col-auto d-flex align-items-center position-relative'>
                                        <div className="color-red">
                                            <GeoFenceIcon />
                                        </div>
                                    </Col>
                                    <Col>
                                        <span className="text-muted mb-0">Cadastre um novo endereço para mais opções de entrega. </span>
                                        <a type="button" className="text-muted small" onClick={() => { setSelectedAddress({}); handleShowFormCreate() }}>Cadastrar Endereço</a>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </section >
            </ModalBody>
            <ModalFooter>
                <div className="px-4">
                    <Button variant={`yellow px-3 float-end btn-sm`} onClick={() => handleSelectedAddress(addressValues)}>Continuar</Button>
                </div>
            </ModalFooter>
        </>
    )
}

function RenderEmptyAddressContent({ showProgressBar, setShowProgressBar, setAction, setAddressStepContent }) {
    if (showProgressBar) {
        setShowProgressBar(false)
    }

    const handleShowFormCreateAddress = () => {
        setAction('create');
        setShowProgressBar(true);
        setAddressStepContent('formAddress');
    }

    return (
        <ModalBody className="d-flex flex-column align-items-center justify-content-center px-5">
            <div className="text-center my-4">
                <AddressMapIcon />
                <h5 className="mt-3">Selecione um endereço para Continuar </h5>
                <p className="text-muted">Você não possui endereços cadastrados, cadastre para continuar com sua compra!</p>
            </div>

            <div className="d-flex align-items-center justify-content-center mt-3">
                <Button variant="yellow py-2 px-5 fw-bold" onClick={() => handleShowFormCreateAddress()}>Cadastrar Endereço</Button>
            </div>
        </ModalBody>
    )
}

function RenderAddressStepFormContent({ selectedAddress, userId, address, setAddress, action, handleSelectedAddress, addressValues, setAddressValues, setAddressStepContent, prevFormAddressValues, setPrevFormAddressValues }) {
    const { getAddressCep, createAddress, updateAddress, errorMessages, setErrorMessages } = AddressServices();
    const [showToastError, setShowToastError] = useState(false);
    const formRef = useRef()
    const { isEquals } = FormValidations();

    const [formAddressValues, setFormAddressValues] = useState(
        {
            cep: selectedAddress?.cep || '',
            address: selectedAddress?.address || '',
            number: selectedAddress?.number || '',
            neighborhood: selectedAddress?.neighborhood || '',
            complement: selectedAddress?.complement || '',
            city: selectedAddress?.city || '',
            state: selectedAddress?.state || '',
            main: selectedAddress.main || false
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        let response;
        if (formRef.current.reportValidity() && !isEquals(formAddressValues, prevFormAddressValues, setPrevFormAddressValues, setErrorMessages)) {
            if (action === 'create') {
                response = await createAddress(formAddressValues, userId);
                if (response) {
                    const updatedAddressValues = formAddressValues.main
                        ? [...address.map(address => ({ ...address, main: false })), response]
                        : [...address, response];

                    setAddress(updatedAddressValues);
                    setAddressValues(response);
                    handleSelectedAddress(response);
                }
            } else if (action === 'update') {
                response = await updateAddress(formAddressValues, selectedAddress?.addressId)
                if (response) {
                    setAddress(address.map(address => address.addressId === response.addressId ? response : address))
                    if (selectedAddress?.addressId === addressValues?.addressId) {
                        console.log('entrou')
                        setAddressValues(response)
                    }
                    setAddressStepContent('renderAddress');
                }
            }
        }
    }

    return (
        <>
            <ModalBody className="overflow-auto">
                <section className="d-flex flex-column h-100 justify-content-center px-4">
                    {action === 'create' ? (
                        <div className="mb-3">
                            <h5 className="">Adicione um Endereço para Continuar </h5>
                            <p className="text-muted mb-0">
                                {address?.length < 0 ? (
                                    <>
                                        Você não possui um endereço cadastrado adicione um para prosseguir com sua compra!
                                    </>
                                ) : (
                                    <>
                                        Cadastre um novo endereço de entrega para continuar com sua compra e receber seus produtos no local desejado!
                                    </>
                                )}
                            </p>

                        </div>
                    ) : (
                        <div className="mb-3">
                            <h4 className="text-muted">Editar Endereço Selecionado</h4>
                            <p className="text-muted mb-0">Atualize o endereço de entrega para garantir que seus produtos sejam recebidos no local desejado de forma segura.</p>
                        </div>

                    )}

                    <FormAddressRegister
                        errorMessages={errorMessages}
                        formAddressValues={formAddressValues}
                        setFormAddressValues={setFormAddressValues}
                        isUpdateId={selectedAddress?.addressId ? true : false}
                        getAddressCep={getAddressCep}
                        formRef={formRef}
                    />
                </section>
            </ModalBody>

            <ModalFooter style={{ justifyContent: 'unset', display: 'unset' }}>
                <div className="px-4">
                    {
                        (selectedAddress?.addressId || action === 'create') && (
                            <>
                                {address?.length > 0 && (
                                    <Button variant="secondary d-flex align-items-center float-start " onClick={() => setAddressStepContent('renderAddress')}>
                                        <ReturnIcon size={'17'} /><span className="ms-2 small">Voltar</span>
                                    </Button>
                                )}

                                <Button variant="yellow float-end" type="submit" onClick={(e) => handleSubmit(e)} style={{ maxHeight: '35px' }}>
                                    {action === 'update' ? 'Editar' : 'Cadastrar'} Endereço
                                </Button>
                            </>
                        )
                    }
                </div>
            </ModalFooter>

            <ToastError
                showToastError={showToastError}
                setShowToastError={setShowToastError}
                errorMessages={errorMessages}
                setErrorMessages={setErrorMessages}
            />
        </>
    )
}

function AddressCard({ currentAddress, handleShowFormUpdate, handleClickCard }) {
    const clickable = !currentAddress?.selectedAddressCard;

    return (
        <Card
            className={` position-relative z-1 mt-2 card-modal-select-address shadow-sm d-flex flex-row`}>
            {!clickable && (
                <CardHeader className="bg-yellow px-1 rounded-0 rounded-start-2 " />
            )}

            <div className="position-absolute end-0 top-0 z-3">
                <Dropdown className="dropdown-no-caret dropdown-center" style={{ cursor: 'pointer' }} >
                    <Dropdown.Toggle className="text-decoration-none text-muted" as="a">
                        <ThreeDotsVerticalIcon />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-1" style={{ minWidth: 'unset', maxWidth: 'unset', width: '6em' }}>
                        <Dropdown.Item className="small" onClick={() => handleShowFormUpdate(currentAddress)}>
                            Editar
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Card.Body onClick={clickable ? () => handleClickCard(currentAddress) : undefined} style={{ cursor: clickable ? 'pointer' : 'default' }} >
                {!currentAddress?.isLoading ? (
                    <Row >
                        <Col className='col-auto d-flex align-items-center position-relative'>
                            <div className="color-red me-2">
                                <GeoFenceIcon />
                            </div>
                        </Col>
                        <Col className="d-flex flex-column justify-content-center">
                            <h6 className="mb-1">
                                <TruncateText text={`${currentAddress?.address}, ${currentAddress?.number}, ${currentAddress?.complement}, ${currentAddress?.neighborhood}`} maxLength={40} />
                            </h6>

                            <span className="text-muted small">
                                <TruncateText text={`${currentAddress?.city}-${currentAddress?.uf || currentAddress?.state}, CEP ${currentAddress?.cep}`} maxLength={40} />
                            </span>
                        </Col>
                    </Row>
                ) : (
                    <div className="d-flex flex-grow-1 align-items-center justify-content-center" style={{ height: 64.5 }}>
                        <span className="loader"></span>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default SelectedAddressContent;