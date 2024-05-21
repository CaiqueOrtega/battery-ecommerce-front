import { Button, Form, Modal } from "react-bootstrap";
import { AddIcon } from "../../../assets/icons/IconsSet"
import { useRef, useState, useContext } from "react";
import FormGroupWithIcon from "../../../components/common/FormGroupWithIcon";
import { AuthContext } from "../../../context/AuthProvider";
import AddressServices from "../../../services/address/AddressServices";

function AddressContent() {
    const [showAddressModal, setShowAddressModal] = useState(false)

    return (
        <>
            <div className="d-flex justify-content-between">
                <h4>Meus Endereços</h4>

                <a type="button" className="text-decoration-none text-danger"
                    onClick={() => setShowAddressModal(true)}
                >
                    <AddIcon />
                    <span className="ms-2">Adicionar novo Endereço</span>
                </a>
            </div>
            <AddressModal setShowAddressModal={setShowAddressModal} showAddressModal={showAddressModal} />
        </>
    );
}

function AddressModal({ setShowAddressModal, showAddressModal }) {
    const { userData } = useContext(AuthContext);
    const { createAddress, getAddress } = AddressServices()
    const formRef = useRef(null)
    const [formAddressValues, setFormAddressValues] = useState({
    CEP: '',
        address: '',
        number: '',
        neighborhood: '',
        complement: '',
        city: '',
        state: ''
    })

    async function handleCepChange(cep) {
        setFormAddressValues({ ...formAddressValues, CEP: cep })
        if (cep.length == 8) {

            const response = await getAddress(cep)
            if (response) {
                setFormAddressValues({
                    CEP: cep,
                    address: response.logradouro,
                    number: formAddressValues.number ? formAddressValues.number : '',
                    complement: formAddressValues.complement ? formAddressValues.complement : '',
                    neighborhood: response.bairro,
                    city: response.localidade,
                    state: response.uf
                })
            }
        }
    }

    async function handleSubmit(){
        const response = await createAddress(formAddressValues, userData.userId)
        console.log(response)
    }

    return (
        <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
            <Modal.Header className="bg-yellow text-white">
                <Modal.Title>Cadastro de Endereço</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowAddressModal(false)} />
            </Modal.Header>
            <Modal.Body>
                <Form ref={formRef}>
                    <Form.Label className="w-100">CEP
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'XXXXX-XXX'}
                            value={formAddressValues.CEP}
                            onChange={(e) => handleCepChange(e.target.value)}
                        />
                    </Form.Label>

                    <Form.Label className="w-100">Logradouro
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'Digite seu endereço'}
                            value={formAddressValues.address}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, address: e.target.value })}
                        />
                    </Form.Label>

                    <Form.Label className="w-100">Número
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'Digite o número do seu endereço'}
                            value={formAddressValues.number}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, number: e.target.value })}
                        />
                    </Form.Label>

                    <Form.Label className="w-100">Bairro
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'Digite seu baitto'}
                            value={formAddressValues.neighborhood}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, neighborhood: e.target.value })}
                        />
                    </Form.Label>

                    <Form.Label className="w-100">Complemento
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'Digite seu complemento'}
                            value={formAddressValues.complement}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, complement: e.target.value })}
                            disableRequired={true}
                            
                        />
                    </Form.Label>

                    <Form.Label className="w-100">Cidade
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'Digite sua cidade'}
                            value={formAddressValues.city}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, city: e.target.value })}
                        />
                    </Form.Label>

                    <Form.Label className="w-100">Estado
                        <FormGroupWithIcon
                            type={'text'}
                            placeholder={'Digite a sigla do seu estado'}
                            value={formAddressValues.state}
                            onChange={(e) => setFormAddressValues({ ...formAddressValues, state: e.target.value })}
                        />
                    </Form.Label>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        if (formRef.current.reportValidity()) {
                            handleSubmit()
                        }
                    }}>Criar Endereço</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddressContent