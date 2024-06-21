import { Card, Table, Modal, Row, Col } from "react-bootstrap";
import SortButton from "../../../components/common/SortButton";
import Pagination from "../../../components/common/Pagination";
import { useState } from "react";
import exemploImageCart from "../../../assets/images/exemploImageRegister.png"

function SaleIndex({ sales, setSales }) {
    const [showModalSale, setShowModalSale] = useState(false);
    const [selectedSale, setSelectedSale] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sales.slice(indexOfFirstItem, indexOfLastItem);
    const [activeField, setActiveField] = useState(null);

    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex'>
                    <h3 className='text-align-center mb-0'>Controle de Vendas</h3>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover bordered >
                        <thead>
                            <tr className='border-2'>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Código da Venda
                                        <SortButton field="description" values={sales} setValues={setSales} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Nome do Cliente
                                        <SortButton field="description" values={sales} setValues={setSales} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Data da Venda
                                        <SortButton field="code" values={sales} setValues={setSales} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Meio de Pagamento
                                        <SortButton field="value" values={sales} setValues={setSales} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Valor da Venda
                                        <SortButton field="name" values={sales} setValues={setSales} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                                <th className='bg-table-header'>
                                    <div className='d-flex justify-content-between py-1'>
                                        Situação
                                        <SortButton field="quantity" values={sales} setValues={setSales} activeField={activeField} setActiveField={setActiveField} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((sales) => (
                                <tr key={sales.saleId} onDoubleClick={() => {
                                    setSelectedSale(sales)
                                    setShowModalSale(true)
                                }}>
                                    <td className='table-cell-pointer'>{sales.code}</td>
                                    <td className='table-cell-pointer'>{sales.user.name}</td>
                                    <td className='table-cell-pointer'>{sales.creationDate}</td>
                                    <td className='table-cell-pointer'>{sales.payment.description}</td>
                                    <td className='table-cell-pointer text-end'>R${sales.value}</td>
                                    <td className='table-cell-pointer'>{sales.payment.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination
                        totalItems={sales.length}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </Card.Body>
            </Card>

            <ModalSale
                showModalSale={showModalSale}
                setShowModalSale={setShowModalSale}
                selectedSale={selectedSale}
            />
        </>
    );
}

function ModalSale({ showModalSale, setShowModalSale, selectedSale }) {
    console.log(selectedSale)
    return (
        <Modal size="lg" show={showModalSale} onHide={() => setShowModalSale(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Venda </Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModalSale(false)} />
            </Modal.Header>
            <Modal.Body className="px-5 py-5">
                <Card>
                    <Card.Body>
                        {selectedSale?.cart?.batteries?.map(item => (
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
            </Modal.Body>
        </Modal>
    )
}


export default SaleIndex;