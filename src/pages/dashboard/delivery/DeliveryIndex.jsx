

import { Card, Table, Modal, Row, Col } from "react-bootstrap";
import SortButton from "../../../components/common/SortButton";
import Pagination from "../../../components/common/Pagination";
import { useState } from "react";
import exemploImageCart from "../../../assets/images/exemploImageRegister.png"
import ModalPdf from "../../../services/pdf/Report"
import { PdfIcon } from "../../../assets/icons/IconsSet";


function ModalDelivery({ showModalDelivery, setShowModalDelivery, selectedDelivery }) {
    return (
        <Modal size="lg" show={showModalDelivery} onHide={() => setShowModalDelivery(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Controle de Entrega </Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModalDelivery(false)} />
            </Modal.Header>
            <Modal.Body className="px-4 py-5">

            </Modal.Body>
        </Modal>
    )
}



function DeliveryIndex({ deliveries, setDeliveries }) {
    const [showModalDelivery, setShowModalDelivery] = useState(false);
    const [showsModalPDF, setShowModalPDF] = useState(false);

    const [selectedDelivery, setSelectedDelivery] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = deliveries.slice(indexOfFirstItem, indexOfLastItem);
    const [activeField, setActiveField] = useState(null);

    return (
        <Card className='shadow rounded-3 mb-5'>
            <Card.Header className='py-3 d-flex justify-content-between'>
                <h3 className='text-align-center mb-0'>Controle de Entregas</h3>
                <a type='button' className='btn btn-outline-danger' onClick={() => setShowModalPDF(true)}><PdfIcon /></a>
            </Card.Header>
            <Card.Body>
                <Table responsive hover bordered>
                    <thead>
                        <tr className='border-2'>
                            <th className='bg-table-header'>
                                <div className='d-flex justify-content-between py-1'>
                                    Código da Venda
                                    <SortButton field="code" values={deliveries} setValues={setDeliveries} activeField={activeField} setActiveField={setActiveField} />
                                </div>
                            </th>
                            <th className='bg-table-header'>
                                <div className='d-flex justify-content-between py-1'>
                                    Endereço de Entrega
                                    <SortButton field="city" values={deliveries} setValues={setDeliveries} activeField={activeField} setActiveField={setActiveField} />
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
                            <tr key={delivery.deliveryId} onDoubleClick={() => {
                                setSelectedDelivery(delivery)
                                setShowModalDelivery(true)
                            }}>
                                <td className='table-cell-pointer'>{delivery.sale.code}</td>
                                <td className='table-cell-pointer'>{`${delivery.address}, ${delivery.number}, ${delivery.city}-${delivery.state}`}</td>
                                <td className='table-cell-pointer'>{delivery.creationDate}</td>
                                <td className='table-cell-pointer'>{delivery.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination
                    totalItems={deliveries.length}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </Card.Body>
        </Card>
    )

}

export default DeliveryIndex;