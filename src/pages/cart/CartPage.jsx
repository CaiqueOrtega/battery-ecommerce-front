import { Card, Col, Row, Button, FormControl, Container } from "react-bootstrap";
import { useGlobalDataProvider } from "../../context/GlobalDataProvider";
import exemploImageCart from "../../assets/images/exemploImageRegister.png";

function CartPage() {
    const { batteryCart } = useGlobalDataProvider();

    return (
        <Container className="py-5">
            <Row>
                <Col md={8}>
                    <RenderCartItemsCard batteryCart={batteryCart} />
                </Col>

                <Col >
                    <RenderCartSummaryCard batteryCart={batteryCart} />
                </Col>
            </Row>
        </Container>
    );
}


function RenderCartItemsCard({ batteryCart }) {

    const BatteryQuantityControl = ({ quantity }) => {
        return (
            <Card style={{ maxWidth: '120px' }}>
                <Row className='g-0'>
                    <Col className='col-auto'>
                        <Button variant="white fw-bold rounded-end-0">-</Button>
                    </Col>
                    <Col className='d-flex align-items-center'>
                        <FormControl
                            type="text"
                            className="flex-grow-0 text-center py-1 border-0"
                            value={quantity}
                        />
                    </Col>
                    <Col className='col-auto'>
                        <Button variant="white fw-bold rounded-start-0 ">+</Button>
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

            <Card.Body className="overflow-auto" style={{maxHeight: '300px'}}>
                {batteryCart?.batteries?.map(item => (
                    <Row key={item.cart_battery_id} className="px-3 mt-2">
                        <Col xs={2}>
                            <img src={exemploImageCart} height={80} className="mr-3" alt="Battery" />
                        </Col>

                        <Col md={6} className="lh-md">
                            <h6 className="fw-bold mb-0 text-wrap">
                                {item.battery.name.length > 47 ? item.battery.name.substring(0, 47) + "..." : item.battery.name}
                            </h6>
                        </Col>

                        <Col className="col-auto d-flex align-items-center justify-content-center">
                            <BatteryQuantityControl quantity={item.quantity} />

                        </Col>

                        <Col className="d-flex justify-content-end align-items-center">
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