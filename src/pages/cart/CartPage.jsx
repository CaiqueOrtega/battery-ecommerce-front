import { Card, Col, Row, Button, FormControl, Container, Accordion, Placeholder, Spinner } from "react-bootstrap";
import { useGlobalDataProvider } from "../../context/GlobalDataProvider";
import exemploImageCart from "../../assets/images/exemploImageRegister.png";
import { AdditionIcon, SubtractionIcon, ShoppingCartIcon, PurchaseIcon, MapIcon, DeliveryIcon, ExclamationCircleIcon } from "../../assets/icons/IconsSet";
import BatteryCartServices from "../../services/cart/BatteryCartServices";
import AddressServices from "../../services/address/AddressServices";
import ConfirmChangesModal from "../../components/common/ConfirmChangesModal";
import ModalSelectedAddress from "../../components/common/ModalAddress";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './cart.css';
import FormValidations from "../../components/common/FormValidation";
import SaleServices from '../../services/sale/SaleServices'
import SaleStepsModal from "../sale/steps/SaleStepsModal";

function CartPage() {
    const { batteryCart, setBatteryCart, batteryCartIsLoaded, isLoggedIn, address, addressIsLoaded, fetchAddress, userData } = useGlobalDataProvider();
    const { getAddressCep, getFreight } = AddressServices();
    const { removeBattery, changeBatteryQuantity, errorMessages, setErrorMessages } = BatteryCartServices();
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});
    const [confirmAction, setConfirmAction] = useState({});
    const [freightValues, setFreightValues] = useState({});
    const [addressValues, setAddressValues] = useState({})
    const [formCEP, setFormCEP] = useState('');
    const [showSelectedAddressModal, setShowSelectedAddressModal] = useState(false);
    const [totalQuantity, setTotalQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            await fetchAddress();
        };

        if (!addressIsLoaded) {
            fetchData();
        }

        if (address && Object.keys(address).length !== 0 && batteryCartIsLoaded) {
            let mainAddress = address.find(addr => addr.main === true) || address[0];

            handleGetFreightByCep(
                mainAddress.cep,
                {
                    logradouro: mainAddress.address,
                    cep: mainAddress.cep,
                    cidade: mainAddress.city,
                    complemento: mainAddress.complement,
                    bairro: mainAddress.neighborhood,
                    numero: mainAddress.number,
                    estado: mainAddress.state
                },
                false,
                handleCalculateTotalQuantity(batteryCart)
            );
        } else if (addressIsLoaded && batteryCartIsLoaded) {
            const hasLocalAddress = localStorage.getItem('cepAddress');

            console.log(hasLocalAddress)
            if (hasLocalAddress) {
                handleGetAddressByCep(null, hasLocalAddress, false);
            }
        }
    }, [addressIsLoaded, batteryCartIsLoaded]);


    const handleGetAddressByCep = async (event, formCEP, isRequestModal) => {
        console.lo
        if (event instanceof Object && event !== null && event.preventDefault) {
            event.preventDefault();
        }
        if (formCEP != addressValues.cep) {
            const response = await getAddressCep(formCEP);
            if (response) {
                if (Object.keys(address).length === 0) {
                    localStorage.setItem('cepAddress', formCEP);
                }
                handleGetFreightByCep(formCEP, response, isRequestModal, handleCalculateTotalQuantity(batteryCart));
            } else {
                setErrorMessages({ cep: 'CEP inválido ou não encontrado' })
            }
        }
    }

    const handleGetFreightByCep = async (formCEP, addressValues, isRequestModal, totalQuantity) => {
        const response = await getFreight(formCEP, totalQuantity);
        if (response) {
            setFreightValues(response);
            if (Object.keys(addressValues).length !== 0) {
                setAddressValues(addressValues);
            }
            if (isRequestModal) {
                setShowSelectedAddressModal(false)
            }
        }
    }

    const handleCalculateTotalQuantity = (updatedBatteryCart) => {
        const newTotalQuantity = updatedBatteryCart.batteries.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0);
        setTotalQuantity(newTotalQuantity)
        return newTotalQuantity
    }

    const handleCartAction = async (action, data) => {
        const actions = {
            'remove': async () => {
                let newTotalValue;
                try {
                    if (isLoggedIn) {
                        const response = await removeBattery(batteryCart.cartId, data.batteryId);
                        newTotalValue = response?.totalValue !== undefined ? response?.totalValue : 0;
                    } else {
                        let localBatteryCart = localStorage.getItem('batteryCart');
                        if (localBatteryCart) {
                            localBatteryCart = JSON.parse(localBatteryCart);

                            const removedBattery = batteryCart.batteries.find(item => item.battery.batteryId === data.batteryId);

                            const removedBatteryValue = removedBattery ? removedBattery?.battery?.value : 0;
                            newTotalValue = localBatteryCart.totalValue -= removedBatteryValue;

                            localBatteryCart.batteries = localBatteryCart.batteries.filter(item =>
                                item.batteryId !== data.batteryId
                            );

                            if (localBatteryCart?.batteries.length === 0) {
                                localStorage.removeItem('batteryCart')
                            } else {
                                localStorage.setItem('batteryCart', JSON.stringify(localBatteryCart));
                            }

                        }
                    }

                    const updatedBatteryCart = {
                        ...batteryCart,
                        batteries: batteryCart.batteries.filter(item =>
                            item.battery.batteryId !== data.batteryId
                        ),
                        totalValue: newTotalValue
                    };

                    const totalQuantity = handleCalculateTotalQuantity(updatedBatteryCart);
                    setBatteryCart(updatedBatteryCart);
                    handleGetFreightByCep(addressValues.cep, {}, false, totalQuantity)
                } catch (e) {
                    console.log('erro ao remover bateria do carrinho', e)
                }
            },
            'changeQuantity': async () => {
                try {
                    let response;
                    if (isLoggedIn) {
                        response = await changeBatteryQuantity(batteryCart.cartId, data.cartBatteryId, data.quantity);
                    } else {
                        let localBatteryCart = localStorage.getItem('batteryCart');
                        if (localBatteryCart) {
                            localBatteryCart = JSON.parse(localBatteryCart);

                            const totalValue = batteryCart.batteries.reduce((accumulator, battery) => {
                                if (battery.cart_battery_id === data.cartBatteryId) {
                                    return accumulator + (battery.battery.value * data.quantity);
                                }
                                return accumulator + (battery.battery.value * battery.quantity);
                            }, 0);

                            localBatteryCart.batteries = localBatteryCart.batteries.map(item => {
                                if (item.cart_battery_id === data.cartBatteryId) {
                                    return { ...item, quantity: data.quantity };
                                }
                                return item;
                            });

                            localBatteryCart.totalValue = totalValue;

                            localStorage.setItem('batteryCart', JSON.stringify(localBatteryCart));
                            response = { totalValue };
                        }
                    }

                    const updatedBatteryCart = {
                        ...batteryCart,
                        totalValue: response.totalValue,
                        batteries: batteryCart.batteries.map(item => {
                            if (item.cart_battery_id === data.cartBatteryId) {
                                return { ...item, quantity: data.quantity };
                            }
                            return item;
                        })
                    };
                    const totalQuantity = handleCalculateTotalQuantity(updatedBatteryCart);
                    setBatteryCart(updatedBatteryCart);
                    handleGetFreightByCep(addressValues.cep, {}, false, totalQuantity)
                } catch (e) {
                    console.log('erro ao mudar quantidade de bateria do carrinho', e)
                }
            }
        };

        if (actions[action]) {
            await actions[action]();
        }
    }

    const handleConfirmChangesModal = async () => {
        if (confirmAction) {
            const { action, data } = confirmAction;
            await handleCartAction(action, data);
        }
    };

    return (
        <>
            <Container className="py-5">
                <Row>
                    <Col md={8}>
                        <RenderCartItemsCard
                            batteryCart={batteryCart}
                            setShowConfirmChangesModal={setShowConfirmChangesModal}
                            setConfirmChangesModalData={setConfirmChangesModalData}
                            setConfirmAction={setConfirmAction}
                            handleCartAction={handleCartAction}
                            setBatteryCart={setBatteryCart}
                            batteryCartIsLoaded={batteryCartIsLoaded}
                            address={address}
                            isLoggedIn={isLoggedIn}
                            formCEP={formCEP}
                            setFormCEP={setFormCEP}
                            handleGetAddressByCep={handleGetAddressByCep}
                            handleGetFreightByCep={handleGetFreightByCep}
                            freightValues={freightValues}
                            addressValues={addressValues}
                            showSelectedAddressModal={showSelectedAddressModal}
                            setShowSelectedAddressModal={setShowSelectedAddressModal}
                            totalQuantity={totalQuantity}
                        />
                    </Col>

                    <Col >
                        <RenderCartSummaryCard batteryCart={batteryCart}
                            batteryCartIsLoaded={batteryCartIsLoaded}
                            freightValues={freightValues}
                            addressIsLoaded={addressIsLoaded}
                            address={address}
                            isLoggedIn={isLoggedIn}
                            userData={userData}
                            addressValues={addressValues}
                        />
                    </Col>
                </Row>
            </Container>

            <ConfirmChangesModal
                showConfirmChangesModal={showConfirmChangesModal}
                setShowConfirmChangesModal={setShowConfirmChangesModal}
                handleConfirmChanges={handleConfirmChangesModal}
                confirmChangesModalData={confirmChangesModalData}
            />
        </>
    );
}

function RenderCartItemsCard({ batteryCart, setShowConfirmChangesModal, setConfirmChangesModalData, setConfirmAction, handleCartAction, batteryCartIsLoaded, isLoggedIn, address, formCEP, setFormCEP, handleGetAddressByCep, handleGetFreightByCep, freightValues, addressValues, showSelectedAddressModal, setShowSelectedAddressModal, totalQuantity }) {
    const { ExtractNumericValue } = FormValidations()

    const handleRemoveBattery = (batteryId) => {
        setShowConfirmChangesModal(true)
        setConfirmChangesModalData({ title: "Remover Bateria", message: "Deseja mesmo Remover a Bateria do Carrinho?" })
        setConfirmAction({ action: 'remove', data: { batteryId: batteryId } });
    }

    const handleChange = (e, setLocalQuantity, batteryQuantity) => {
        let newQuantity = parseInt(e.target.value);
        console.log(newQuantity);
        if (newQuantity <= 0) {
            newQuantity = 1;
        } else if (newQuantity > batteryQuantity) {
            newQuantity = batteryQuantity;
        }
        setLocalQuantity(ExtractNumericValue(newQuantity))
    }

    const handleBlur = (localQuantity, setLocalQuantity, cartBatteryId, setPrevQuantity, prevQuantity) => {
        if (prevQuantity !== localQuantity) {
            if (localQuantity.trim() !== '' && localQuantity !== '0') {
                setPrevQuantity(localQuantity)
                handleCartAction('changeQuantity', { cartBatteryId: cartBatteryId, quantity: localQuantity })
            } else {
                setLocalQuantity(prevQuantity);
            }
        }
    }

    const handleChangeQuantity = (isAddition, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef, batteryQuantity, setPrevQuantity) => {
        let newQuantity;
        let currentQuantity = parseInt(localQuantity)
        if (isAddition) {
            newQuantity = Math.min(batteryQuantity, currentQuantity + 1);
        } else {
            newQuantity = Math.max(1, currentQuantity - 1);
        }

        if (newQuantity !== currentQuantity) {
            setLocalQuantity(ExtractNumericValue(newQuantity));
            setPrevQuantity(ExtractNumericValue(newQuantity))
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            timeoutIdRef.current = setTimeout(() => {
                handleCartAction('changeQuantity', { cartBatteryId: cartBatteryId, quantity: newQuantity })
            }, 1000);
        }
    };

    const BatteryQuantityControl = ({ quantity, batteryQuantity, cartBatteryId }) => {
        const [localQuantity, setLocalQuantity] = useState(quantity.toString());
        const [prevQuantity, setPrevQuantity] = useState(quantity.toString());

        const timeoutIdRef = useRef(null);

        useEffect(() => {
            return () => {
                if (timeoutIdRef.current) {
                    clearTimeout(timeoutIdRef.current);
                }
            };
        }, []);

        return (
            <Card style={{ maxWidth: '130px' }}>
                <Row className='g-0'>
                    <Col className='col-auto'>
                        <Button variant={`white fw-bold rounded-end-0 ${localQuantity === 1 ? 'bg-light' : ''}`}
                            onMouseDown={() => handleChangeQuantity(false, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef, batteryQuantity, setPrevQuantity)}
                        ><SubtractionIcon size={15} /></Button>
                    </Col>
                    <Col className='d-flex align-items-center'>
                        <FormControl
                            type="text"
                            className="flex-grow-0 text-center py-1 border-0"
                            value={localQuantity}
                            onBlur={() => handleBlur(localQuantity, setLocalQuantity, cartBatteryId, setPrevQuantity, prevQuantity)}
                            onChange={(e) => handleChange(e, setLocalQuantity, batteryQuantity)}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <Button variant={`white fw-bold rounded-start-0 ${batteryQuantity === localQuantity ? 'bg-light' : ''}`}
                            onMouseDown={() => handleChangeQuantity(true, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef, batteryQuantity, setPrevQuantity)}
                        >
                            <AdditionIcon size={15} />
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    };

    const getEstimatedArrivalDate = (estimateDays) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + estimateDays);
        const options = { day: 'numeric', month: 'long' };
        return currentDate.toLocaleDateString('pt-BR', options);
    };

    return (
        <>
            <Card className={`border-0 shadow ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light' : ''}`}>
                <Card.Header className={`fw-bold py-3 ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light text-muted' : 'bg-white'}`}>
                    Carrinho de Baterias
                </Card.Header>

                <Card.Body className="overflow-auto" style={{ height: Object.keys(batteryCart).length !== 0 && batteryCart?.batteries?.length !== 0 ? 350 : 389 }}>
                    {!batteryCartIsLoaded ? (
                        <div className="d-flex flex-grow-1 align-items-center justify-content-center h-100">
                            <span className="loader"></span>
                        </div>
                    ) : (
                        <>
                            {Object.keys(batteryCart).length != 0 && batteryCart?.batteries?.length != 0 ? (
                                <>
                                    {batteryCart?.batteries?.map(item => (
                                        <Row key={item.cart_battery_id} className="px-3 mt-2 d-flex align-items-center">
                                            <Col xs={2} md={2} className="p-0">
                                                <img src={exemploImageCart} height={80} className="img-fluid" alt="Battery" />
                                            </Col>

                                            <Col md={5} xs={9} className="ms-3 lh-md p-0 ">
                                                <h6 className="mb-0 text-wrap">
                                                    {item.battery.name.length > 30 ? item.battery.name.substring(0, 30) + "..." : item.battery.name}
                                                </h6>
                                                <a type="button" className="small text-muted" onClick={() => handleRemoveBattery(item.battery.batteryId)}>Remover</a>
                                            </Col>

                                            <Col className="col-auto d-flex flex-column align-items-center small position-relative" >
                                                <BatteryQuantityControl quantity={item.quantity} cartBatteryId={item.cart_battery_id} batteryQuantity={item.battery.quantity} />

                                                <span className="text-muted small position-absolute" style={{ bottom: -17 }}>
                                                    {item.battery.quantity} unidade{item.battery.quantity > 1 && 's'}
                                                </span>
                                            </Col>

                                            <Col className="d-flex align-items-center">
                                                <span className="ms-auto font-numbers">R$ {item.battery.value.toFixed(2).replace('.', ',')}</span>
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <section className="d-flex  align-items-center justify-content-center py-5">
                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                            <ShoppingCartIcon />
                                            <span className="mt-2">Seu carrinho de compras está vazio!</span>
                                            <span className="text-muted small">Adicione baterias para continuar com sua compra</span>

                                            <Button as={Link} to="/" variant="yellow mt-4 fw-bold w-100 py-2">Ver Baterias Disponíveis</Button>
                                        </div>
                                    </section>
                                </>
                            )}

                        </>
                    )}
                </Card.Body>
                {batteryCartIsLoaded && batteryCart?.batteries?.length !== 0 && (
                    <Card.Footer className="bg-light px-4">
                        {addressValues && Object.keys(addressValues).length > 0 || localStorage.getItem('cepAddress') ? (
                            <>
                                {Object.keys(addressValues).length != 0 ? (
                                    <div className="d-flex justify-content-between">
                                        <a type="button" className="text-muted small" onClick={() => setShowSelectedAddressModal(true)}>
                                            <MapIcon size={'15px'} />
                                            <span className="ms-1">
                                                {addressValues?.logradouro || addressValues?.localidade}, {addressValues?.bairro || addressValues?.uf}
                                            </span>
                                        </a>

                                        <span className="text-muted small d-flex align-items-center"><DeliveryIcon size={18} />
                                            <span className="mx-1">
                                                Recebe até
                                            </span>
                                            {getEstimatedArrivalDate(freightValues?.estimateDays)}
                                            <span className="text-success ms-1 font-numbers">
                                                - R${freightValues?.totalFreightCost.toFixed(2)}
                                            </span>
                                        </span>
                                    </div>
                                ) : (
                                    <Placeholder as='span' animation="glow" className="small d-flex justify-content-between">
                                        <Placeholder xs={5} />
                                        <Placeholder xs={4} />
                                    </Placeholder>
                                )
                                }
                            </>
                        ) : (
                            <a type="button" className="text-muted" onClick={() => setShowSelectedAddressModal(true)}>Calcular Frete</a>
                        )}
                    </Card.Footer>
                )}
            </Card>
            <ModalSelectedAddress
                address={address}
                setShowSelectedAddressModal={setShowSelectedAddressModal}
                showSelectedAddressModal={showSelectedAddressModal}
                handleGetFreightByCep={handleGetFreightByCep}
                formCEP={formCEP}
                setFormCEP={setFormCEP}
                handleGetAddressByCep={handleGetAddressByCep}
                isLoggedIn={isLoggedIn}
                quantity={totalQuantity}
            />
        </>
    )
}

function RenderCartSummaryCard({ batteryCart, batteryCartIsLoaded, freightValues, addressIsLoaded, address, isLoggedIn, userData, addressValues }) {
    const [showPopover, setShowPopover] = useState(false);
    const [showSaleStepsModal, setShowSaleStepsModal] = useState();
    const { createSale } = SaleServices();

    const handleContinueSale = () =>{
        setShowSaleStepsModal(true);
    }

    return (
        <>
            <Card className={`border-0 shadow h-100  ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light' : ''}`}>
                <Card.Header className={`fw-bold py-3 ${batteryCartIsLoaded && batteryCart?.batteries?.length === 0 ? 'bg-light text-muted' : 'bg-white'}`} >
                    Resumo da compra
                </Card.Header>
                <Card.Body className="d-flex flex-column justify-content-between px-4 overflow-auto" style={{ height: Object.keys(batteryCart).length !== 0 && batteryCart?.batteries?.length !== 0 ? 350 : 389 }}>

                    {!batteryCartIsLoaded ? (
                        <div className="d-flex flex-grow-1 align-items-center justify-content-center">
                            <span className="loader"></span>
                        </div>
                    ) : (
                        <>
                            {Object.keys(batteryCart).length != 0 && batteryCart?.batteries?.length != 0 ? (
                                <>
                                    <section>
                                        <Accordion defaultActiveKey="0" flush>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Button className="d-flex justify-content-between p-0">
                                                    <span className="small">
                                                        Produtos ({batteryCart?.batteries?.length})
                                                    </span>
                                                </Accordion.Button>
                                                <Accordion.Body className="p-0 overflow-auto custom-scrollbar" style={{ MaxHeight: 175 }}>
                                                    <hr className="opacity-25" />

                                                    {batteryCart?.batteries.map((items, index) => (
                                                        <div key={items.cart_battery_id} className={`${index > 0 ? 'mt-2' : ''} d-flex justify-content-between align-items-center`}>
                                                            <span className="small ">
                                                                {items.battery.name.length > 20 ? items.battery.name.substring(0, 20) + '...' : items.battery.name}
                                                                <span className="text-muted"> <span className="small">x</span>{items.quantity}</span>
                                                            </span>
                                                            <span className="font-numbers small">R${(items.battery.value * items.quantity).toFixed(2).replace('.', ',')}</span>
                                                        </div>
                                                    ))}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        <hr className="opacity-25" />
                                        <div className="d-flex justify-content-between small my-1">
                                            <span>SubTotal</span>
                                            <span>R${batteryCart.totalValue.toFixed(2).replace('.', ',')}</span>
                                        </div>

                                        <div className="d-flex justify-content-between position-relative">
                                            <span className="small">Valor Frete</span>
                                            <span>
                                                {freightValues?.totalFreightCost ? (
                                                    <span className="font-numbers small">
                                                        R$ {freightValues?.totalFreightCost}
                                                    </span>
                                                ) : addressIsLoaded && !localStorage.getItem('addressCep') && address?.length === 0 ? (
                                                    <>
                                                        <div
                                                            className="input-progress-container position-absolute z-1 mt-2"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '100%',
                                                                right: -20,
                                                                visibility: showPopover ? 'visible' : 'hidden'
                                                            }}
                                                        >
                                                            <div className="popover shadow-sm">
                                                                <div className='popover-header py-1'>
                                                                    <span className='small'>Frete Não Calculado</span>
                                                                </div>
                                                                <div className="d-flex align-items-center justify-content-center popover-content p-2">
                                                                    <span>
                                                                        Por favor, insira um CEP ou selecione um endereço para calcular o valor do frete.
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <a
                                                            className='float-end ms-2 text-muted z-3 position-relative'
                                                            type="button"
                                                            onMouseOver={() => setShowPopover(true)}
                                                            onMouseOut={() => setShowPopover(false)}
                                                        >
                                                            <ExclamationCircleIcon />
                                                        </a>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Spinner size="sm" animation="border" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </Spinner>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </section>

                                    <section>
                                        <div className="d-flex justify-content-between" style={{ fontSize: '18px' }}>
                                            <span className="fw-bold ">Total</span>
                                            <span className="fw-bold font-numbers">R$
                                                <span className="ms-2">
                                                    {((batteryCart?.totalValue || 0) + (freightValues?.totalFreightCost || 0))
                                                        .toFixed(2)
                                                        .replace('.', ',')}
                                                </span>
                                            </span>
                                        </div>
                                        <Button variant="yellow fw-bold w-100 py-2 mt-2" onClick={() => handleContinueSale()}>Continuar a Compra</Button>
                                    </section>
                                </>
                            ) : (
                                <section className="d-flex align-items-center justify-content-center flex-grow-1">

                                    <div className="d-flex flex-column align-items-center justify-content-center">
                                        <PurchaseIcon />
                                        <span className="text-muted small mt-3">Assim que você adicionar produtos ao carrinho, verá aqui o resumo dos valores da sua compra.</span>
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                </Card.Body>
            </Card >

            <SaleStepsModal
            showSaleStepsModal={showSaleStepsModal} 
            setShowSaleStepsModal={setShowSaleStepsModal}
            isLoggedIn={isLoggedIn}
            addressValues={addressValues}
            address={address}
            userData={userData}
            />
        </>
    )
}

export default CartPage;