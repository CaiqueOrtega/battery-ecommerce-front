import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { AddAddressIcon, CityIcon, MapIcon, NeighborHood, NumberIcon, ReturnIcon, StateIcon, StreetIcon, TextBodyIcon } from "../../../assets/icons/IconsSet"
import { useRef, useState, useEffect } from "react";
import FormGroupWithIcon from "../../../components/common/FormGroupWithIcon";
import { useAuthProvider } from "../../../context/AuthProvider";
import AddressServices from "../../../services/address/AddressServices";
import { useGlobalDataProvider } from "../../../context/GlobalDataProvider";
import FormValidations from "../../../components/common/FormValidation";
import AlertErrorOrSuccess from "../../../components/common/AlertErrorOrSuccess";
import ConfirmChangesModal from "../../../components/common/ConfirmChangesModal"

function AddressContent() {
    const { createAddress, getAddressCep, updateAddress, updateMainAddress, deleteAddress, errorMessages, setErrorMessages } = AddressServices()
    const { fetchAddress, address, setAddress } = useGlobalDataProvider();
    const { userData } = useAuthProvider();
    const { isEquals } = FormValidations();

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [confirmChangesModalData, setConfirmChangesModalData] = useState(false);
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);


    const [selectedFormAddressValues, setSelectedFormAddressValues] = useState({});
    const [prevFormAddressValues, setPrevFormAddressValues] = useState({})
    const [formAddressValues, setFormAddressValues] = useState({
        cep: '',
        address: '',
        number: '',
        neighborhood: '',
        complement: '',
        city: '',
        state: '',
        main: false
    })


    useEffect(() => {
        const fetchData = async () => {
            await fetchAddress();
        };
        if (Object.keys(address).length === 0) {
            fetchData();
        }
    }, []);


    useEffect(() => {
        if (showAddressForm) {
            setErrorMessages({});
            setPrevFormAddressValues({});
            setFormAddressValues({
                cep: selectedFormAddressValues.cep || '',
                address: selectedFormAddressValues.address || '',
                number: selectedFormAddressValues.number || '',
                neighborhood: selectedFormAddressValues.neighborhood || '',
                complement: selectedFormAddressValues.complement || '',
                city: selectedFormAddressValues.city || '',
                state: selectedFormAddressValues.state || '',
                main: selectedFormAddressValues.main || false
            })
        }
        if (selectedFormAddressValues) {
            const { addressId, ...rest } = selectedFormAddressValues;
            setPrevFormAddressValues(rest);
        }

    }, [showAddressForm])

    const handleConfirmChangesModal = async () => {

        const getUpdateAddressData = async () => {
            if (confirmAction.action === 'update') {
                const response = await updateAddress(confirmAction.data.formAddressValues, confirmAction.data.addressId);
                if (response) {
                    setShowAddressForm(false);
                    return (address.map(address => address.addressId === response.addressId ? response : address));
                }
            } else if (confirmAction.action === 'delete') {
                const response = await deleteAddress(confirmAction.data.addressId);
                if (response) {
                    return (address.filter(address =>
                        address.addressId !== confirmAction.data.addressId
                    ));
                }
            }
            return undefined;
        };

        const updatedAddressData = await getUpdateAddressData();

        if (updatedAddressData !== undefined) {
            setAddress(updatedAddressData);
        } else {
            setPrevFormAddressValues(confirmAction.data.formAddressValues);
        }
    };

    const handleAddressAction = async (e, action, data) => {
        e.preventDefault();
        const actions = {
            'create': async () => {
                if (address.length === 0) {
                    data.formAddressValues.main = true;
                }

                const response = await createAddress(data.formAddressValues, userData.userId);
                if (response) {
                    const updatedAddressValues = data.formAddressValues.main
                        ? [...address.map(address => ({ ...address, main: false })), response]
                        : [...address, response];

                    setAddress(updatedAddressValues);
                    setShowAddressForm(false);
                }
            },
            'update': async () => {
                setShowConfirmChangesModal(true);
                setConfirmChangesModalData({ title: 'Editar Endereço', message: 'Deseja realmente editar o Endereço?' });
                setConfirmAction({ action, data });
                setPrevFormAddressValues({});
            },
            'delete': async () => {
                setShowConfirmChangesModal(true);
                setConfirmChangesModalData({ title: 'Deletar Endereço', message: 'Deseja realmente editar o Endereço?' });
                setConfirmAction({ action, data });
            },
            'update_main': async () => {
                const response = await updateMainAddress(data.addressId);
                if (response) {
                    setAddress(address.map(address =>
                        ({ ...address, main: address.addressId === data.addressId })
                    ));
                }
            }
        };

        const isValid = action !== 'update_main' && action !== 'delete' ? !isEquals(data.formAddressValues, prevFormAddressValues, setPrevFormAddressValues, setErrorMessages) : true

        if (actions[action] && isValid) {
            await actions[action]();
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center px-5 py-3 bg-yellow text-white fw-bold">

                {showAddressForm ? (
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <a type="button" onClick={() => setShowAddressForm(false)}><ReturnIcon /> Voltar</a>
                        <h4 className="mb-0">Controle de Endereços</h4>
                    </div>
                ) : (
                    <>
                        <h4 className="mb-0">Meus Endereços</h4>
                        {address?.length != 3 && (
                            <a type="button" className="text-decoration-none text-white"
                                onClick={() => { setSelectedFormAddressValues({}); setShowAddressForm(true) }}
                            >
                                <AddAddressIcon />
                                <span className="ms-2">Adicionar novo Endereço</span>
                            </a>
                        )}
                    </>
                )}
            </div >

            <div className="h-100 py-5 px-md-5 px-4 d-flex-justify-content-center" >
                {showAddressForm ? (
                    <AddressForm
                        setShowAddressForm={setShowAddressForm}
                        showAddressForm={showAddressForm}
                        formAddressValues={formAddressValues}
                        setFormAddressValues={setFormAddressValues}
                        isUpdateId={selectedFormAddressValues?.addressId}
                        handleAddressAction={handleAddressAction}
                        setPrevFormAddressValues={setPrevFormAddressValues}
                        getAddressCep={getAddressCep}
                        errorMessages={errorMessages}
                    />
                ) : (
                    address.length !== 0 ? (
                        <UserAddress
                            address={address}
                            setAddress={setAddress}
                            setSelectedFormAddressValues={setSelectedFormAddressValues}
                            setShowAddressForm={setShowAddressForm}
                            handleAddressAction={handleAddressAction}
                        />
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100">
                            <h3 className="text-dark text-muted">Nenhum Endereço Cadastrado</h3>
                        </div>
                    )
                )}
            </div>
            <ConfirmChangesModal
                showConfirmChangesModal={showConfirmChangesModal}
                setShowConfirmChangesModal={setShowConfirmChangesModal}
                handleConfirmChanges={handleConfirmChangesModal}
                confirmChangesModalData={confirmChangesModalData}
            />

        </>
    );
}

function AddressForm(props) {

    async function handleCepChange(cep) {
        const cleanedCep = cep.replace(/\D/g, '');

        props.setFormAddressValues({ ...props.formAddressValues, cep: cleanedCep });

        if (cleanedCep.length === 8) {
            const response = await props.getAddressCep(cleanedCep);
            if (response) {
                props.setFormAddressValues({
                    ...props.formAddressValues,
                    cep: cleanedCep,
                    address: response.logradouro,
                    number: props.formAddressValues.number || '',
                    complement: props.formAddressValues.complement || '',
                    neighborhood: response.bairro,
                    city: response.localidade,
                    state: response.uf,
                });
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (props.isUpdateId) {
            props.handleAddressAction(e, 'update', {
                addressId: props.isUpdateId,
                formAddressValues: props.formAddressValues
            });
        } else {
            props.handleAddressAction(e, 'create', { formAddressValues: props.formAddressValues })
        }

    }

    return (
        <section>
            <h3>{props.isUpdateId ? 'Editar o' : 'Cadastro de'} Endereço</h3>
            <button className='btn-close btn-close-white' onClick={() => props.setShowAddressForm(false)} />

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="col-5">
                        <Form.Label className="w-100">CEP
                            <FormGroupWithIcon
                                icon={<MapIcon className='position-absolute ms-3' currentColor={'#a3a29f'} />}
                                type={'text'}
                                placeholder={'XXXXX-XXX'}
                                value={props.formAddressValues.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                                maxLength={8}
                                feedback={props.errorMessages.CEP}
                            />
                        </Form.Label>
                    </Col>

                    <Col className="col-md-7">
                        <Form.Label className="w-100">Complemento
                            <FormGroupWithIcon
                                icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                                type={'text'}
                                placeholder={'Digite seu complemento'}
                                value={props.formAddressValues.complement}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, complement: e.target.value })}
                                disableRequired={true}
                                feedback={props.errorMessages.complement}
                            />
                        </Form.Label>
                    </Col>

                    <Col className="col-9">
                        <Form.Label className="w-100">Rua
                            <FormGroupWithIcon
                                icon={<StreetIcon className='position-absolute ms-3' />}
                                type={'text'}
                                placeholder={'Digite seu endereço'}
                                value={props.formAddressValues.address}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, address: e.target.value })}
                                feedback={props.errorMessages.address}
                            />
                        </Form.Label>
                    </Col>

                    <Col className="col-md-3">
                        <Form.Label className="w-100">Número
                            <FormGroupWithIcon
                                icon={<NumberIcon className='position-absolute ms-3' />}
                                type={'text'}
                                placeholder={'Digite o número do seu endereço'}
                                value={props.formAddressValues.number}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, number: e.target.value })}
                                feedback={props.errorMessages.number}

                            />
                        </Form.Label>
                    </Col>

                    <Col className="col-5">
                        <Form.Label className="w-100">Bairro
                            <FormGroupWithIcon
                                icon={<NeighborHood className='position-absolute ms-3' />}
                                type={'text'}
                                placeholder={'Digite seu bairro'}
                                value={props.formAddressValues.neighborhood}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, neighborhood: e.target.value })}
                                feedback={props.errorMessages.neighborhood}
                            />
                        </Form.Label>
                    </Col>

                    <Col className="col-md-4">
                        <Form.Label className="w-100">Cidade
                            <FormGroupWithIcon
                                icon={<CityIcon className='position-absolute ms-3' />}
                                type={'text'}
                                placeholder={'Digite sua cidade'}
                                value={props.formAddressValues.city}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, city: e.target.value })}
                                feedback={props.errorMessages.city}
                            />
                        </Form.Label>
                    </Col>

                    <Col className="col-md-3">
                        <Form.Label className="w-100">UF
                            <FormGroupWithIcon
                                icon={<StateIcon className='position-absolute ms-3' />}
                                type={'text'}
                                placeholder={'Digite a sigla do seu estado'}
                                value={props.formAddressValues.state}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, state: e.target.value })}
                                feedback={props.errorMessages.uf}
                            />
                        </Form.Label>
                    </Col>

                    {!props.isUpdateId ? (
                        <Col className="col-md-12">
                            <Form.Check
                                label={'Endereço principal'}
                                checked={props.formAddressValues.main}
                                onChange={(e) => props.setFormAddressValues({ ...props.formAddressValues, main: e.target.checked })}
                            />
                        </Col>
                    ) : null}

                </Row>
                <Col xs={12} className="d-flex justify-content-between">
                    <div className="d-flex align-items-end flex-grow-1">
                        <AlertErrorOrSuccess errorMessages={props.errorMessages} />
                    </div>
                    <div className="d-flex justify-content-end mt-5 flex-grow-1">
                        <Button variant="yellow float-end mt-5"
                            type="submit">{props.isUpdateId ? 'Editar' : 'Cadastrar'} Endereço</Button>
                    </div>
                </Col>

            </Form>
        </section >
    );
}

function UserAddress(props) {
    if (!Array.isArray(props.address) && props.address.length === 0) {
        return null;
    }

    const handleOpenFormUpdate = (address) => {
        props.setSelectedFormAddressValues(address);
        props.setShowAddressForm(true);
    }

    return (
        <>
            {props.address.map((address, index) => (
                <Card key={index} className={`rounded-3 shadow-sm ${index > 0 ? 'mt-4' : ''}`}>
                    <Card.Header className="d-flex justify-content-between ">
                        <span className="fw-bold text-muted">{address.address}, {address.number}, {address?.complement}</span>


                        <Form.Label className="d-flex small text-muted">
                            {address.main && ('Endereço Principal')}
                            <Form.Check type={'radio'} className={`ms-2`}
                                checked={address.main}
                                readOnly={address.main}
                                onChange={(e) => !address.main && props.handleAddressAction(e, 'update_main', { addressId: address.addressId })}
                            />
                        </Form.Label>

                    </Card.Header>
                    <Card.Body>
                        <Row >
                            <Col className="d-flex flex-column">
                                <span>{address.neighborhood}, {address.city}, {address.state}</span>
                                <span>CEP: {address.cep}</span>
                            </Col>

                            <Col className="col-auto align-self-end ">
                                <Button
                                    variant="sm btn-red-outline px-4 fw-bold rounded-4 shadow-sm"
                                    onClick={(e) => props.handleAddressAction(e, 'delete', { addressId: address.addressId })}
                                >
                                    Excluir
                                </Button>
                                <Button variant="sm btn-yellow ms-2  px-4 fw-bold rounded-4 shadow-sm" onClick={() => handleOpenFormUpdate(address)}>Editar</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}
        </>
    );
}




export default AddressContent;