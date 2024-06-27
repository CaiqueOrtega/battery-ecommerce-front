import { useEffect, useState } from "react";
import { useGlobalDataProvider } from "../../../context/GlobalDataProvider";
import { Row, Col, Card, ProgressBar } from "react-bootstrap";
import exemploImageCart from "../../../assets/images/exemploImageRegister.png"
import { CarrierIcon, HourGlassIcon, CheckCart, CheckTruckIcon, FilledCheck, ReturnIcon, BoxesIcons } from "../../../assets/icons/IconsSet";

function OrderContent() {
    const { fetchUserDelivery, deliveryUser, setDeliveryUser, deliveryIsLoaded, } = useGlobalDataProvider();
    const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState({})

    const handleClickDelivery = (delivery) => {
        setSelectedDelivery(delivery);
        setShowDeliveryInfo(true);
    }


    useEffect(() => {
        const fetchData = async () => {
            await fetchUserDelivery();
        }
        if (!deliveryIsLoaded) {
            fetchData();
            console.log(deliveryUser)
        }
    }, [deliveryUser])

    return (
        <>
            <div className="d-flex justify-content-between align-items-center px-5 py-3 bg-yellow text-white fw-bold" style={{ maxHeight: 60 }}>
                {showDeliveryInfo ? (
                    <>
                        <a type="button" onClick={() => setShowDeliveryInfo(false)}><ReturnIcon /> Voltar</a>

                        <h4 className="mb-0 "><span>Informações do Pedido</span></h4>
                    </>
                ) : (
                    <h4 className="mb-0"><BoxesIcons /> <span className="ms-2">Seus Pedidos</span></h4>
                )}
            </div>

            <div className="h-100 py-5 px-md-4 px-4 d-flex-justify-content-center align-items-center custom-scrollbar overflow-auto" style={{ maxHeight: 535 }}>
                {showDeliveryInfo ? (
                    <RenderDeliveryInfo
                        selectedDelivery={selectedDelivery}
                    />
                ) : (
                    deliveryUser && deliveryUser?.length > 0 ? (

                        <RenderOrders
                            deliveryUser={deliveryUser}
                            handleClickDelivery={handleClickDelivery}
                        />
                    ) : (
                        <div className="d-flex flex-grow-1 h-100 align-items-center justify-content-center">
                            <h4 className="text muted">Você ainda não possui nenhum pedido</h4>
                        </div>
                    )
                )}
            </div>
        </>


    )
}

function RenderDeliveryInfo({ selectedDelivery }) {
    const [progressBarDelivery, setProgressBarDelivery] = useState(0);
    const statusToProgressIndex = {
        AGUARDANDO: 0,
        CONFIRMADO: 1,
        PREPARANDO: 2,
        TRANSITO: 3,
        ENTREGUE: 4
    };

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = statusToProgressIndex[selectedDelivery.status];
            for (let i = 0; i <= currentProgress; i++) {
                setTimeout(() => {
                    setProgressBarDelivery(i);
                }, i * 500);
            }
        };

        if (selectedDelivery && selectedDelivery?.status) {
            updateProgress();
        }
    }, [selectedDelivery]);


    return (
        <>
            <div className="mb-4">
                <h4 className="text-muted">Veja o progresso detalhado do seu pedido</h4>
                <span className="text-muted">Veja o progresso detalhado do seu pedido enquanto ele avança pelo processo de entrega. Fique atualizado em tempo real!</span>
            </div>
            <Card>
                <Card.Header className="text-muted bg-white d-flex justify-content-between">
                    <span>Situação do Pedido</span>
                    <span className="small">#{selectedDelivery.sale.code}</span>
                </Card.Header>
                <Card.Body className="py-5 px-2">
                    <Row className="g-0">
                        <Col className="d-flex justify-content-center">
                            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 100 }}>
                                <div className="d-flex flex-column align-items-center  lh-1 position-absolute">
                                    <HourGlassIcon currentColor={progressBarDelivery >= 0 ? '#fec117' : '#d9d9d9'} />
                                    <span className="small text-center text-muted mt-1">Pedido Recebido</span>
                                </div>
                            </div>
                            <div className="progress-container position-relative d-flex align-items-center w-100">
                                <div className="progress w-100" style={{ height: 3 }}>
                                    <div
                                        className={`progress-bar progress-delivery bg-yellow`}
                                        role="progressbar"
                                        style={{ width: `${progressBarDelivery >= 0 ? '100%' : '0%'}` }}
                                        aria-valuenow={progressBarDelivery}
                                        aria-valuemin="1"
                                        aria-valuemax="5"
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 100 }}>
                                <div className="position-absolute d-flex flex-column align-items-center text-center lh-1">
                                    <CheckCart currentColor={progressBarDelivery >= 1 ? '#fec117' : '#d9d9d9'} />
                                    <span className="small text-muted ">Pedido Confirmado</span>
                                </div>
                            </div>
                            <div className="progress-container position-relative d-flex align-items-center w-100">
                                <div className="progress w-100" style={{ height: 3 }}>
                                    <div
                                        className={`progress-bar progress-delivery bg-yellow`}
                                        role="progressbar"
                                        style={{ width: `${progressBarDelivery >= 1 ? '100%' : '0%'}` }}
                                        aria-valuenow={progressBarDelivery}
                                        aria-valuemin="1"
                                        aria-valuemax="5"
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 100 }}>
                                <div className="d-flex flex-column position-absolute align-items-center lh-1">
                                    <CarrierIcon currentColor={progressBarDelivery >= 2 ? '#fec117' : '#d9d9d9'} />
                                    <span className="small text-center text-muted mt-1">Preparando seu Pedido</span>
                                </div>
                            </div>
                            <div className="progress-container position-relative d-flex align-items-center w-100">
                                <div className="progress w-100" style={{ height: 3 }}>
                                    <div
                                        className={`progress-bar progress-delivery bg-yellow`}
                                        role="progressbar"
                                        style={{ width: `${progressBarDelivery >= 2 ? '100%' : '0%'}` }}
                                        aria-valuenow={progressBarDelivery}
                                        aria-valuemin="1"
                                        aria-valuemax="5"
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center">
                            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 100 }}>
                                <div className="d-flex flex-column position-absolute align-items-center lh-1">
                                    <CheckTruckIcon currentColor={progressBarDelivery >= 3 ? '#fec117' : '#d9d9d9'} />
                                    <span className="small text-center text-muted mt-1"><span>a&nbsp;caminho</span> de você</span>
                                </div>
                            </div>
                            <div className="progress-container position-relative d-flex align-items-center w-100">
                                <div className="progress w-100" style={{ height: 3 }}>
                                    <div
                                        className={`progress-bar progress-delivery bg-yellow`}
                                        role="progressbar"
                                        style={{ width: `${progressBarDelivery >= 3 ? '100%' : '0%'}` }}
                                        aria-valuenow={progressBarDelivery}
                                        aria-valuemin="1"
                                        aria-valuemax="5"
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col className="col-auto d-flex  justify-content-center">
                            <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: 55 }}>
                                <div className="d-flex flex-column position-absolute align-items-center lh-1">
                                    <FilledCheck currentColor={progressBarDelivery >= 4 ? '#fec117' : '#d9d9d9'} />
                                    <span className="small text-center text-muted mt-1">Pedido Entregue</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body >
            </Card>

            <Card className="mt-4">
                <Card.Header className="bg-white">
                    <Card.Text>Items do Pedido</Card.Text>
                </Card.Header>
                <Card.Body className="overflow-auto" style={{ maxHeight: 111.500 }}>
                    {
                        selectedDelivery.sale.cart.batteries.map(item => (
                            <Row key={item.cart_battery_id} className="px-3 mt-2 d-flex align-items-center">
                                <Col xs={2} md={2} className="p-0">
                                    <img src={exemploImageCart} width={80} className="img-fluid" alt="Battery" />
                                </Col>

                                <Col md={4} xs={9} className="ms-3 lh-md p-0 ">
                                    <h6 className="mb-0 text-wrap">
                                        {item.battery.name.length > 30 ? item.battery.name.substring(0, 30) + "..." : item.battery.name}
                                    </h6>
                                </Col>

                                <Col className="col-auto d-flex align-items-center justify-content-center" >
                                    <span className="text-muted small" style={{ bottom: -17 }}>
                                        {item.quantity} unidade{item.quantity > 1 && 's'}
                                    </span>
                                </Col>

                                <Col className="d-flex align-items-center">
                                    <span className="ms-auto font-numbers">R$ {item.battery.value.toFixed(2).replace('.', ',')}</span>
                                </Col>
                            </Row>
                        ))
                    }
                </Card.Body>
            </Card>
        </>
    )
}

function RenderOrders({ deliveryUser, handleClickDelivery }) {

    const handleStatusColor = (status) => {
        switch (status) {
            case 'AGUARDANDO':
                return '#808080'
            case 'CONFIRMADO':
                return '#406ae2'
            case 'PREPARANDO':
                return '#cf8e6d'
            case 'TRANSITO':
                return '#c00d0d'
            case 'ENTREGUE':
                return '#35cd4b'
        }
    }

    return (
        <>
            <div className="mb-4">
                <h4 className="text-muted">Veja o progresso detalhado dos seus pedidos</h4>
                <span className="text-muted">Explore todos os seus pedidos recentes em um único lugar. Acompanhe o status, histórico de compras e detalhes de entrega facilmente.</span>
            </div>
            {deliveryUser?.map((delivery, index) => (
                <div key={delivery.deliveryId}>
                    <Card className={`d-flex flex-row ${index > 0 ? 'mt-3' : ''} `} style={{ cursor: 'pointer' }} onClick={() => handleClickDelivery(delivery)}>
                        <Card.Header className={`px-1 rounded-0 rounded-start-2`}
                            style={{ backgroundColor: handleStatusColor(delivery.status) }} />
                        <Card.Body className="rounded-2">
                            <div></div>
                            <Row className="px-2 mt-2 d-flex align-items-center">
                                <Col className="lh-md justify-content-center d-flex flex-column small">
                                    <h6 className="mb-0 text-wrap">
                                        Código
                                    </h6>
                                    <span className="text-nowrap text-muted">
                                        {`# ${delivery.sale.code}`}
                                    </span>
                                </Col>

                                <Col className="lh-md justify-content-center d-flex flex-column small">
                                    <h6 className="mb-0 text-wrap">
                                        Pagamento
                                    </h6>
                                    <span className="text-muted">{delivery.sale.payment.description}</span>
                                </Col>
                                <Col className="lh-md justify-content-center d-flex flex-column small">
                                    <h6 className="mb-0 text-wrap">
                                        Data
                                    </h6>
                                    <span className="text-muted">{delivery.creationDate}</span>
                                </Col>

                                <Col className="lh-md justify-content-center d-flex flex-column small">
                                    <h6 className="mb-0 text-wrap">
                                        Situação
                                    </h6>
                                    <span className="text-muted">{delivery.status}</span>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div >
            ))
            }
        </>
    );
}


export default OrderContent;