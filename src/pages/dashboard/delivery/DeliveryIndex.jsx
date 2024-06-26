

import { Card, Table, Modal, Row, Col, Form, Spinner } from "react-bootstrap";
import SortButton from "../../../components/common/SortButton";
import Pagination from "../../../components/common/Pagination";
import { useState, useEffect } from "react";
import exemploImageCart from "../../../assets/images/exemploImageRegister.png"
import ModalPdf from "../../../services/pdf/Report"
import { GoogleMapsICon, PdfIcon, WaitingIcon, ConfirmedIcon, PreparingIcon, TrafficIcon, DeliveredIcon, ToEditIcon, AddSquareIcon, EmptyDeliveryIcon } from "../../../assets/icons/IconsSet";
import DeliveryServices from "../../../services/delivery/DeliveryServices";
import "./delivery.css";

function DeliveryIndex({ deliveries, setDeliveries, deliveriesIsLoaded }) {
    const [showModalDelivery, setShowModalDelivery] = useState(false);
    const [showsModalPDF, setShowModalPDF] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = deliveries.slice(indexOfFirstItem, indexOfLastItem);
    const [activeField, setActiveField] = useState(null);

    const [trackingCode, setTrackingCode] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(selectedDelivery.status);
    const [isAnimationCircle, setIsAnimationCircle] = useState(false);
    const [progressBarDelivery, setProgressBarDelivery] = useState('');
    const statusToProgressIndex = {
        AGUARDANDO: 0,
        CONFIRMADO: 1,
        PREPARANDO: 2,
        TRANSITO: 3,
        ENTREGUE: 4
    };

    const handleShowModalDelivery = (delivery) => {
        setSelectedDelivery(delivery)
        setShowModalDelivery(true)
        setProgressBarDelivery(statusToProgressIndex[delivery.status]);
        setIsAnimationCircle(false);
        setSelectedStatus(delivery.status)
        setTrackingCode(delivery.trackingCode)
    }

    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex justify-content-between'>
                    <h3 className='text-align-center mb-0'>Controle de Entregas</h3>
                    <a type='button' className='btn btn-outline-danger' onClick={() => setShowModalPDF(true)}><PdfIcon /></a>
                </Card.Header>
                <Card.Body>
                    {deliveries?.length > 0 ? (
                        <Table responsive hover bordered>
                            <thead>
                                <tr className='border-2'>
                                    <th className='bg-table-header'>
                                        <div className='d-flex justify-content-between py-1'>
                                            Código da Venda
                                        </div>
                                    </th>
                                    <th className='bg-table-header'>
                                        <div className='d-flex justify-content-between py-1'>
                                            Endereço de Entrega
                                        </div>
                                    </th>
                                    <th className='bg-table-header'>
                                        <div className='d-flex justify-content-between py-1'>
                                            Data de Criação
                                            <SortButton field="creationDate" values={deliveries} setValues={setDeliveries} activeField={activeField} setActiveField={setActiveField} />
                                        </div>
                                    </th>
                                    <th className='bg-table-header'>
                                        <div className='d-flex justify-content-between py-1'>
                                            Situação
                                            <SortButton field="status" values={deliveries} setValues={setDeliveries} activeField={activeField} setActiveField={setActiveField} />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((delivery) => (
                                    <tr key={delivery.deliveryId} onDoubleClick={() => handleShowModalDelivery(delivery)}>
                                        <td className='table-cell-pointer'>#{delivery.sale.code}</td>
                                        <td className='table-cell-pointer'>{`${delivery.address}, ${delivery.number}, ${delivery.city}-${delivery.state}`}</td>
                                        <td className='table-cell-pointer'>{delivery.creationDate}</td>
                                        <td className='table-cell-pointer'>{delivery.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        !deliveriesIsLoaded ? (
                            <div className='h-100 d-flex flex-grow-1 align-items-center justify-content-center'>
                                <Spinner animation="border" role="status" style={{ color: '#c00d0d' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center py-5">
                                <EmptyDeliveryIcon />
                                <span className="mt-2">Você ainda não tem nenhuma entrega adicionada!</span>
                                <span className="text-muted small">Aguarde uma venda ser realizada para exibi-la</span>
                            </div>
                        )
                    )}

                    {deliveriesIsLoaded && deliveries.length > 0 && (
                        <Pagination
                            totalItems={deliveries.length}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </Card.Body>
            </Card>
            {selectedDelivery && Object.keys(selectedDelivery).length > 0 && (
                <ModalDelivery
                    showModalDelivery={showModalDelivery}
                    setShowModalDelivery={setShowModalDelivery}
                    selectedDelivery={selectedDelivery}
                    setDeliveries={setDeliveries}
                    statusToProgressIndex={statusToProgressIndex}
                    progressBarDelivery={progressBarDelivery}
                    setProgressBarDelivery={setProgressBarDelivery}
                    isAnimationCircle={isAnimationCircle}
                    setIsAnimationCircle={setIsAnimationCircle}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    setSelectedDelivery={setSelectedDelivery}
                    trackingCode={trackingCode}
                    setTrackingCode={setTrackingCode}
                />
            )}

            {showsModalPDF && (
                <ModalPdf setShowModalPDF={setShowModalPDF} showsModalPDF={showsModalPDF} currentItems={deliveries} type={'delivery'} />
            )}

        </>
    )
}

function ModalDelivery({ showModalDelivery, setShowModalDelivery, selectedDelivery, setSelectedDelivery, setDeliveries, statusToProgressIndex, progressBarDelivery, setProgressBarDelivery, isAnimationCircle, setIsAnimationCircle, selectedStatus, setSelectedStatus, trackingCode, setTrackingCode }) {

    const { updateStatus, updateTrackingCode } = DeliveryServices();
    const [changeStatus, setChangeStatus] = useState(true);
    const icons = [< WaitingIcon />, <ConfirmedIcon />, <PreparingIcon />, <TrafficIcon />, <DeliveredIcon />];

    const fetchInitials = (userDataName) => {
        let initials = '';
        if (userDataName) {
            const names = userDataName.split(' ');
            if (names.length >= 2) {
                initials = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
            } else if (names.length === 1) {
                initials = names[0].slice(0, 2).toUpperCase();
            }
        }
        return initials;
    }

    useEffect(() => {
        if (selectedStatus && selectedStatus !== selectedDelivery.status) {
            handleUpdateStatus(selectedStatus);
        }
    }, [selectedStatus]);


    const handleUpdateStatus = async (newStatus) => {
        const response = await updateStatus(selectedDelivery.deliveryId, newStatus);
        if (response) {
            setIsAnimationCircle(true);
            setDeliveries(prevDeliveries =>
                prevDeliveries.map(delivery =>
                    delivery.deliveryId === selectedDelivery.deliveryId ? { ...delivery, status: newStatus } : delivery
                )
            );
            setSelectedDelivery({ ...selectedDelivery, status: newStatus })
            setProgressBarDelivery(statusToProgressIndex[selectedStatus]);
        }
    }

    const handleUpdateTrackingCode = async () => {
        const response = await updateTrackingCode(selectedDelivery.deliveryId, trackingCode);
        if (response) {
            setChangeStatus(true)
        }
    }

    return (
        <Modal size="lg" show={showModalDelivery} onHide={() => setShowModalDelivery(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Controle de Entrega <span>#{selectedDelivery.sale.code}</span></Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModalDelivery(false)} />
            </Modal.Header>
            <Modal.Body className="px-4 py-5">
                <Row>
                    <Col md={12}>
                        <Card className="mb-4">
                            <Card.Header className="d-flex align-items-center bg-white py-4">
                                <section className="px-2 w-100">
                                    <div className="progress-container position-relative d-flex align-items-center">
                                        <div className="position-absolute d-flex justify-content-between w-100">
                                            {[...Array(5)].map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`
                                                         ${index === progressBarDelivery ? isAnimationCircle ? 'filled-circle-red' : 'bg-red' : index < progressBarDelivery ? 'bg-red' : 'bg-progressBar'}
                                                        rounded-circle  text-white d-flex justify-content-center align-items-center`}
                                                    style={{ width: 45, height: 45 }}
                                                >
                                                    {icons[index]}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="progress w-100 bg-progressBar">
                                            <div
                                                className={`progress-bar progress-delivery bg-red`}
                                                role="progressbar"
                                                style={{ width: `${(progressBarDelivery / 4) * 100}%` }}
                                                aria-valuenow={progressBarDelivery}
                                                aria-valuemin="1"
                                                aria-valuemax="5"
                                            />
                                        </div>
                                    </div>
                                </section>
                            </Card.Header>
                            <Card.Body className="py-2 px-4">
                                <div className="d-flex justify-content-between align-items-center">

                                    <Form.Label className="position-relative">
                                        Situação do Pedido
                                        <Form.Select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            disabled={selectedDelivery.status === 'ENTREGUE'}
                                        >
                                            <option
                                                value='AGUARDANDO'
                                                disabled={statusToProgressIndex['AGUARDANDO'] <= statusToProgressIndex[selectedDelivery.status]}>
                                                Aguardando...
                                            </option>
                                            <option
                                                value="CONFIRMADO"
                                                disabled={statusToProgressIndex['CONFIRMADO'] <= statusToProgressIndex[selectedDelivery.status]}>
                                                Pedido Confirmado
                                            </option>
                                            <option
                                                value="PREPARANDO"
                                                disabled={statusToProgressIndex['PREPARANDO'] <= statusToProgressIndex[selectedDelivery.status]}>
                                                Pedido sendo Preparado
                                            </option>
                                            <option
                                                value="TRANSITO"
                                                disabled={statusToProgressIndex['TRANSITO'] <= statusToProgressIndex[selectedDelivery.status]}>
                                                Pedido em Trânsito
                                            </option>
                                            <option
                                                value="ENTREGUE"
                                                disabled={statusToProgressIndex['ENTREGUE'] <= statusToProgressIndex[selectedDelivery.status]}>
                                                Pedido Entregue
                                            </option>
                                        </Form.Select>
                                        {selectedDelivery.status === 'ENTREGUE' && (
                                            <div className="position-absolute end-0 top-50 me-2 px-2" style={{ backgroundColor: '#e9ecef' }}>
                                                <ConfirmedIcon currentColor={'#29cb41'} />
                                            </div>
                                        )}
                                    </Form.Label>

                                    <Form.Label>
                                        Código de Rastreio
                                        <div className="position-relative">
                                            <Form.Control
                                                type={'text'}
                                                className={'py-1'}
                                                disabled={changeStatus}
                                                value={trackingCode}
                                                onChange={(e) => setTrackingCode(e.target.value)}
                                            />

                                            <div className='position-absolute top-50 end-0 translate-middle-y d-flex justify-content-center '>
                                                <a type="button"
                                                    className="text-muted end-0 me-2"
                                                    onClick={() => changeStatus ? setChangeStatus(false) : handleUpdateTrackingCode()}
                                                >{changeStatus ? <ToEditIcon /> : <AddSquareIcon />}
                                                </a>
                                            </div>
                                        </div>
                                    </Form.Label>
                                </div>
                            </Card.Body>

                        </Card>
                    </Col>
                    <Col md={12}>
                        <Card className="h-100">
                            <Card.Header className="d-flex justify-content-between py-3 px-4 bg-white">
                                <h6 className="text-muted fw-bold mb-0">Items Da venda</h6>
                                <span className="small">Frete <span className="text-muted">R${selectedDelivery.sale.freightValue}</span></span>
                            </Card.Header>
                            <Card.Body className="h-100 overflow-auto" style={{ maxHeight: 182.967 }}>
                                {selectedDelivery?.sale?.cart?.batteries?.map(item => (
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
                                                {item.quantity} unidade{item.battery.quantity > 1 && 's'}
                                            </span>
                                        </Col>

                                        <Col className="d-flex align-items-center">
                                            <span className="ms-auto font-numbers">R$ {item.battery.value.toFixed(2).replace('.', ',')}</span>
                                        </Col>
                                    </Row>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="mt-4">
                            <Card.Body className="d-flex align-items-center">
                                <Row className="w-100 px-2">
                                    <Col xs={3} className="d-flex align-items-center justify-content-center p-0">
                                        <div className="rounded-circle  bg-body-secondary text-dark-emphasis d-flex justify-content-center align-items-center border" style={{ width: '60px', height: '60px' }}>
                                            <span style={{ fontSize: '1.7rem' }}>{fetchInitials(selectedDelivery?.sale?.user?.name)}</span>
                                        </div>
                                    </Col>
                                    <Col xs={9} className="ps-2 p-0 d-flex align-items-center">
                                        <div className="lh-sm d-flex flex-column">
                                            <h6 className="text-muted fw-bold mb-0">Dados do Cliente</h6>
                                            <hr className="my-2" />
                                            <span className="d-flex flex-column">
                                                <span> {selectedDelivery?.sale?.user?.name}</span>
                                                <a
                                                    className="text-muted"
                                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedDelivery?.sale?.user?.email}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {selectedDelivery?.sale.user?.email}
                                                </a>
                                            </span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6}>
                        <Card className="mt-4" style={{ cursor: 'pointer' }}
                            onClick={() => window.open(`https://www.google.com/maps/place/${`${selectedDelivery.address} ${selectedDelivery.number} ${selectedDelivery.city} ${selectedDelivery.state} ${selectedDelivery.cep}`.replace(/ /g, '+')}/`, '_blank')}>
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <h6 className="text-muted fw-bold mb-0">Endereço de Entrega</h6>
                                    <GoogleMapsICon size={'20px'} />
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex flex-column lh-sm">
                                    <span>{selectedDelivery.address}, {selectedDelivery.number}, {selectedDelivery.city}-{selectedDelivery.state}</span>
                                    <span className="text-muted">{selectedDelivery.neighborhood}, CEP {selectedDelivery.cep}</span>
                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default DeliveryIndex;