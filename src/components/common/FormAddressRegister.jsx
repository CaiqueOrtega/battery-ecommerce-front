import { Form, Col, Row, Button } from "react-bootstrap";
import { MapIcon, TextBodyIcon, StreetIcon, NumberIcon, CityIcon, NeighborHood, StateIcon } from "../../assets/icons/IconsSet";
import AlertErrorOrSuccess from "./AlertErrorOrSuccess";
import FormGroupWithIcon from "./FormGroupWithIcon";


function FormAddressRegister({ errorMessages, formAddressValues, setFormAddressValues, isUpdateId, getAddressCep, formRef }) {

    async function handleCepChange(cep) {
        const cleanedCep = cep.replace(/\D/g, '');

        setFormAddressValues({ ...formAddressValues, cep: cleanedCep });

        if (cleanedCep.length === 8) {
            const response = await getAddressCep(cleanedCep);
            if (response) {
                setFormAddressValues({
                    ...formAddressValues,
                    cep: cleanedCep,
                    address: response.address,
                    number: formAddressValues.number || '',
                    complement: response.complement ||  formAddressValues.complement,
                    neighborhood: response.neighborhood,
                    city: response.city,
                    state: response.state,
                });
            }
        }
    }

    return (

        <Form ref={formRef}>
            <Row>
                <Col className="col-5">
                    <Form.Label className="w-100">CEP
                        <FormGroupWithIcon
                            icon={<MapIcon className='position-absolute ms-3' currentColor={'#a3a29f'} />}
                            type={'text'}
                            placeholder={'Digite seu CEP'}
                            value={formAddressValues.cep}
                            onChange={(e) => handleCepChange(e.target.value)}
                            maxLength={9}
                            feedback={errorMessages.CEP}
                            mask={'99999-999'}
                        />
                    </Form.Label>
                </Col>

                <Col className="col-md-7">
                    <Form.Label className="w-100">Complemento
                        <FormGroupWithIcon
                            icon={<TextBodyIcon className='position-absolute ms-3' currentColor='#a3a29f' />}
                            type={'text'}
                            placeholder={'Digite seu complemento'}
                            value={formAddressValues.complement}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, complement: e.target.value })}
                            disableRequired={true}
                            feedback={errorMessages.complement}
                        />
                    </Form.Label>
                </Col>

                <Col className="col-9">
                    <Form.Label className="w-100">Rua
                        <FormGroupWithIcon
                            icon={<StreetIcon className='position-absolute ms-3' />}
                            type={'text'}
                            placeholder={'Digite seu endereço'}
                            value={formAddressValues.address}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, address: e.target.value })}
                            feedback={errorMessages.address}
                        />
                    </Form.Label>
                </Col>

                <Col className="col-md-3">
                    <Form.Label className="w-100">Número
                        <FormGroupWithIcon
                            icon={<NumberIcon className='position-absolute ms-3' />}
                            type={'text'}
                            placeholder={'Digite o número do seu endereço'}
                            value={formAddressValues.number}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, number: e.target.value })}
                            feedback={errorMessages.number}

                        />
                    </Form.Label>
                </Col>

                <Col className="col-5">
                    <Form.Label className="w-100">Bairro
                        <FormGroupWithIcon
                            icon={<NeighborHood className='position-absolute ms-3' />}
                            type={'text'}
                            placeholder={'Digite seu bairro'}
                            value={formAddressValues.neighborhood}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, neighborhood: e.target.value })}
                            feedback={errorMessages.neighborhood}
                        />
                    </Form.Label>
                </Col>

                <Col className="col-md-4">
                    <Form.Label className="w-100">Cidade
                        <FormGroupWithIcon
                            icon={<CityIcon className='position-absolute ms-3' />}
                            type={'text'}
                            placeholder={'Digite sua cidade'}
                            value={formAddressValues.city}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, city: e.target.value })}
                            feedback={errorMessages.city}
                        />
                    </Form.Label>
                </Col>

                <Col className="col-md-3">
                    <Form.Label className="w-100">UF
                        <FormGroupWithIcon
                            icon={<StateIcon className='position-absolute ms-3' />}
                            type={'text'}
                            placeholder={'Digite a sigla do seu estado'}
                            value={formAddressValues.state}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, state: e.target.value })}
                            feedback={errorMessages.uf}
                        />
                    </Form.Label>
                </Col>

                {!isUpdateId ? (
                    <Col className="col-md-12">
                        <Form.Check
                            label={'Endereço principal'}
                            checked={formAddressValues.main}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, main: e.target.checked })}
                        />
                    </Col>
                ) : null}

            </Row>
        </Form>
    )
}

export default FormAddressRegister;