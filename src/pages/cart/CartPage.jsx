import { Card, Col, Row, Button, FormControl, Container } from "react-bootstrap";
import { useGlobalDataProvider } from "../../context/GlobalDataProvider";
import exemploImageCart from "../../assets/images/exemploImageRegister.png";
import { AdditionIcon, SubtractionIcon } from "../../assets/icons/IconsSet";
import BatteryCartServices from "../../services/cart/BatteryCartServices";
import ConfirmChangesModal from "../../components/common/ConfirmChangesModal";
import { useState, useEffect, useRef } from "react";

function CartPage() {
    const { batteryCart, setBatteryCart } = useGlobalDataProvider();
    const { removeBattery, changeBatteryQuantity } = BatteryCartServices();
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});
    const [confirmAction, setConfirmAction] = useState({});


    const handleCartAction = async (action, data) => {
        console.log(action, data)
        const actions = {
            'remove': async () => {
                const response = await removeBattery(batteryCart.cartId, data.batteryId);
                if (response) {
                    setBatteryCart(batteryCart.filter(item =>
                        item.battery.batteryId !== data.batteryId
                    ));
                }
            },
            'changeQuantity': async () => {
                const response = await changeBatteryQuantity(batteryCart.cartId, data.cartBatteryId, data.quantity);
                if (response) {
                    setBatteryCart(batteryCart.filter(item =>
                        item.battery.batteryId !== data.batteryId
                    ));
                }
            }
        };

        if (actions[action]) {
            await actions[action]();
        } else {
            console.log('Ação inválida:', action);
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
                        />
                    </Col>

                    <Col >
                        <RenderCartSummaryCard batteryCart={batteryCart} />
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


function RenderCartItemsCard({ batteryCart, setShowConfirmChangesModal, setConfirmChangesModalData, setConfirmAction, handleCartAction }) {
    const handleRemoveBattery = (batteryId) => {
        setShowConfirmChangesModal(true)
        setConfirmChangesModalData({ title: "Remover Bateria", message: "Deseja mesmo Remover a Bateria do Carrinho?" })
        setConfirmAction({ action: 'remove', data: { batteryId: batteryId }});
    }



    const handleBlur = (setLocalQuantity) => {
        let newQuantity = parseInt(e.target.value);
        if (isNaN(newQuantity) || newQuantity <= 0) {
            newQuantity = 1;
        }
        setLocalQuantity(newQuantity);
    };


    const handleChangeQuantity = (isAddition, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef) => {
        let newQuantity;

        if (isAddition) {
            newQuantity = localQuantity + 1;
            setLocalQuantity(newQuantity);
        } else {
            newQuantity = localQuantity > 1 ? localQuantity - 1 : 1;
            setLocalQuantity(newQuantity);
        }

        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }
        timeoutIdRef.current = setTimeout(() => {
            console.log('Timer expired', newQuantity, cartBatteryId);
            handleCartAction('changeQuantity',  { cartBatteryId: cartBatteryId, quantity: newQuantity})
        }, 1000);
    };


    const BatteryQuantityControl = ({ quantity, cartBatteryId }) => {
        const [localQuantity, setLocalQuantity] = useState(quantity);
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
                        <Button variant="white fw-bold rounded-end-0"
                            onMouseDown={() => handleChangeQuantity(false, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef)}
                        ><SubtractionIcon size={15} /></Button>
                    </Col>
                    <Col className='d-flex align-items-center'>
                        <FormControl
                            type="text"
                            className="flex-grow-0 text-center py-1 border-0"
                            value={localQuantity}
                            onBlur={(e) => handleBlur(e, localQuantity, setLocalQuantity)}
                            onChange={(e) => setLocalQuantity(e.target.value)}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <Button variant="white fw-bold rounded-start-0"
                            onMouseDown={() => handleChangeQuantity(true, localQuantity, setLocalQuantity, cartBatteryId, timeoutIdRef)}
                        >
                            <AdditionIcon size={15} />
                        </Button>
                    </Col>
                </Row>
            </Card>
        );
    };

    return (
        <Card className="border-0 shadow">
            <Card.Header className="fw-bold py-3 bg-white">
                Carrinho de Baterias
            </Card.Header>

            <Card.Body className="overflow-auto" style={{ maxHeight: '300px' }}>
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

                        <Col className="col-auto d-flex flex-column align-items-center small">
                            <BatteryQuantityControl quantity={item.quantity} cartBatteryId={item.cart_battery_id} />
                            <span className="text-muted small">{item.battery.quantity} unidade{item.battery.quantity > 1 && 's'} </span>
                        </Col>

                        <Col className="d-flex justify-content-end">
                            <span className="ms-auto">R$ {item.battery.value.toFixed(2)}</span>
                        </Col>
                    </Row>
                ))}
            </Card.Body>

            <Card.Footer>
                Frete
            </Card.Footer>
        </Card>
    )
}


function RenderCartSummaryCard({ batteryCart }) {
    return (
        <Card className="border-0 shadow h-100">
            <Card.Header className="fw-bold py-3 bg-white">
                Resumo da compra
            </Card.Header>
            <Card.Body className="d-flex flex-column justify-content-between px-4">
                <section>
                    <div className="d-flex justify-content-between">
                        <span>Produtos({batteryCart?.batteries?.length})</span>
                        <span>R$ {batteryCart?.totalValue}</span>
                    </div>

                    <div className="d-flex justify-content-between">
                        <span>Frete</span>
                        <span>R$</span>
                    </div>


                </section>

                <section>
                    <div className="d-flex justify-content-between">
                        <span className="fw-bold fs-5">Total</span>
                        <span className="fw-bold fs-5">R$ {batteryCart?.totalValue}</span>
                    </div>
                    <Button variant="yellow fw-bold w-100 py-2 mt-2">Continuar a Compra</Button>
                </section>
            </Card.Body>
        </Card >
    )
}

export default CartPage;