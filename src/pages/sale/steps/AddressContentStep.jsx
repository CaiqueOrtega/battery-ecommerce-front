import { Modal, Card, Row, Col } from "react-bootstrap";
import { MapIcon } from "../../../assets/icons/IconsSet";
import { useState } from "react";
import AddressServices from "../../../services/address/AddressServices";
import FormValidations from "../../../components/common/FormValidation";
import FormAddressRegister from "../../../components/common/FormAddressRegister";

function AddressFormContentStep({ addressValues, userId }) {
    const { getAddressCep, createAddress, errorMessages, setErrorMessages } = AddressServices();
    const [prevFormAddressValues, setPrevFormAddressValues] = useState({});
    const { isEquals } = FormValidations();

    console.log(addressValues)
    const [formAddressValues, setFormAddressValues] = useState(
        {
            cep: addressValues?.cep,
            address: addressValues?.logradouro,
            number: addressValues?.numero,
            neighborhood: addressValues?.bairro,
            complement: addressValues?.complemento,
            city: addressValues?.localidade,
            state: addressValues?.uf,
            main: false
        });

    const handleSubmit = async () => {
        if (!isEquals(formAddressValues, prevFormAddressValues, setPrevFormAddressValues, setErrorMessages)) {
            const response = await createAddress(formAddressValues, userId);
            console.log('TESTA', response || errorMessages)
        }

    }

    return (
        <Modal.Body className="px-4 py-5 ">
            <h5 className="">Adicione um Endereço para Continuar </h5>
            <p className="text-muted mb-4">Você não possui um endereço cadastrado adicione um para prosseguir com sua compra!</p>

            <FormAddressRegister
                handleSubmit={handleSubmit}
                errorMessages={errorMessages}
                formAddressValues={formAddressValues}
                setFormAddressValues={setFormAddressValues}
                isUpdateId={false}
                getAddressCep={getAddressCep}
            />
        </Modal.Body>
    )
}

function AddressListContentStep({ address}) {
console.log(address)
    return (
        <Modal.Body className="p-5">
            <span className='text-muted fw-bold'>Ou escolha um endereço cadastrado</span>
            {
                address.map((address, index) => (
                    <Card key={index}
                        className={`${index > 0 ? 'mt-2' : ''} card-modal-select-address shadow-sm d-flex flex-row `} >
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
        </Modal.Body>
    )
}


export { AddressFormContentStep, AddressListContentStep };