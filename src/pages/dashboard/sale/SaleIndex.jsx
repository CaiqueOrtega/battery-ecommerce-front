import { Card, Table, Modal, Row, Col, Button, Container } from "react-bootstrap";
import SortButton from "../../../components/common/SortButton";
import Pagination from "../../../components/common/Pagination";
import { useEffect, useState, useRef } from "react";
import exemploImageCart from "../../../assets/images/exemploImageRegister.png"
import ModalPdf from "../../../services/pdf/Report"
import { PdfIcon, SimpleDollarIcon, CalendarIcon, CaretDownIcon } from "../../../assets/icons/IconsSet";

function SaleIndex({ sales, setSales }) {
    const [showModalSale, setShowModalSale] = useState(false);
    const [showsModalPDF, setShowModalPDF] = useState(false);
    const [selectedSale, setSelectedSale] = useState({});

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sales.slice(indexOfFirstItem, indexOfLastItem);
    const [activeField, setActiveField] = useState(null);
    const [totalSaleValues, setTotalSaleValues] = useState(0)

    const calculateTotalSales = () => {
        console.log(selectedDay, selectedMonth, selectedYear)
        let totalSales = 0;

        const noDateFilters = selectedYear === null && selectedMonth === null && selectedDay === null;

        sales.forEach(sale => {
            const [day, month, year] = sale.creationDate.split('/');
            const saleYear = parseInt(year, 10);
            const saleMonth = parseInt(month, 10);
            const saleDay = parseInt(day, 10);

            console.log('outro', saleYear, saleMonth, saleDay)

            const filterByYear = selectedYear === null || saleYear === selectedYear;
            const filterByMonth = selectedMonth === null || saleMonth === selectedMonth;
            const filterByDay = selectedDay === null || saleDay === selectedDay;

            if (filterByYear && filterByMonth && filterByDay) {
                totalSales += sale.value;
            } else if (filterByYear && filterByMonth && selectedDay === null) {
                totalSales += sale.value;
            } else if (filterByYear && selectedMonth === null && selectedDay === null) {
                totalSales += sale.value;
            }
        });

        if (noDateFilters) {
            totalSales = sales.reduce((acc, sale) => acc + sale.value, 0);
        }
        const formattedTotalSales = totalSales.toFixed(2).replace('.', ',');
        setTotalSaleValues(formattedTotalSales);
    };

    useEffect(() => {
        if (!showCalendar) {
            calculateTotalSales();
        }
    }, [showCalendar])


    return (
        <>
            <Card className='shadow rounded-3 mb-5'>
                <Card.Header className='py-3 d-flex justify-content-between'>
                    <h3 className='text-align-center mb-0'>Controle de Vendas</h3>
                    <a type='button' className='btn btn-outline-danger' onClick={() => setShowModalPDF(true)}><PdfIcon /></a>
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

                    <section className="d-flex justify-content-between">
                        <Card className="position-relative flex-grow-0 d-flex flex-row rounded-3"
                            style={{ maxHeight: 80 }}
                        >

                            <Card.Header className="bg-red px-1 rounded-0 rounded-start-3">
                            </Card.Header>

                            <Card.Body className="d-flex align-items-center px-4" style={{ minWidth: 206.117 }}>
                                <SimpleDollarIcon />
                                <h5 className="text-muted mb-0 ms-2"> {totalSaleValues}</h5>
                            </Card.Body>
                            <div className="position-absolute end-0 me-2">
                                <a type="button" onClick={() => setShowCalendar(true)}>
                                    <span className="text-muted me-2" style={{ fontSize: 12 }}>{selectedDay}/{selectedMonth}/{selectedYear}</span>
                                    <CalendarIcon />
                                </a>
                            </div>
                            <div className="position-absolute" style={{ top: -300, right: -250 }}>
                                {showCalendar && (
                                    <Calendar
                                        selectedDay={selectedDay} setSelectedDay={setSelectedDay}
                                        selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                                        selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                                        setShowCalendar={setShowCalendar}
                                    />
                                )}
                            </div>
                        </Card>

                        <Pagination
                            totalItems={sales.length}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </section>
                </Card.Body >
            </Card >

            {selectedSale && Object.keys(selectedSale).length > 0 && (
                <ModalSale
                    showModalSale={showModalSale}
                    setShowModalSale={setShowModalSale}
                    selectedSale={selectedSale}
                />
            )
            }
            <ModalPdf setShowModalPDF={setShowModalPDF} showsModalPDF={showsModalPDF} currentItems={sales} type={'sale'} />
        </>
    );
}

function ModalSale({ showModalSale, setShowModalSale, selectedSale }) {
    console.log(selectedSale)
    return (
        <Modal size="lg" show={showModalSale} onHide={() => setShowModalSale(false)} backdrop="static" keyboard={false} style={{ zIndex: 1050 }}>
            <Modal.Header className='bg-red text-white'>
                <Modal.Title>Venda {selectedSale.code}</Modal.Title>
                <button className='btn-close btn-close-white' onClick={() => setShowModalSale(false)} />
            </Modal.Header>
            <Modal.Body className="px-4 py-5">
                <Row>
                    <Col md={8}>
                        <Card className="h-100">
                            <Card.Header className="py-3" style={{ backgroundColor: '#f8f8f8' }}>
                                <h6 className="text-muted fw-bold mb-0">Items Da venda</h6>
                            </Card.Header>
                            <Card.Body className="h-100">
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
                    </Col>
                    <Col>
                        <Card className="h-100">
                            <Card.Header className="py-3" style={{ backgroundColor: '#f8f8f8' }}>
                                <h6 className="text-muted fw-bold mb-0">Resumo da venda</h6>
                            </Card.Header>
                            <Card.Body className="h-100">
                                <div className="d-flex justify-content-between">
                                    <span>SubTotal</span>
                                    <span className="text-muted">R$ {selectedSale.value.toFixed(2).replace('.', ',')}</span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span>Frete</span>
                                    <span className="text-muted">R$ {selectedSale.freightValue.toFixed(2).replace('.', ',')}</span>
                                </div>
                            </Card.Body>
                            <Card.Footer className="bg-white">
                                <div className="d-flex justify-content-between">
                                    <span className="fw-bold">Total</span>
                                    <span className="text-muted">
                                        R$ {((selectedSale.freightValue || 0) + (selectedSale.value || 0)).toFixed(2).toString().replace('.', ',')}
                                    </span>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>

            </Modal.Body>
        </Modal>
    )
}



function Calendar({ selectedDay, setSelectedDay, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, setShowCalendar }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const calendarRef = useRef(null);

    useEffect(() => {
        if (selectedDay && selectedMonth && selectedYear) {
            setSelectedDate(new Date(selectedYear, selectedMonth - 1, selectedDay));
        } else {
            setSelectedDate(null);
        }
    }, [selectedDay, selectedMonth, selectedYear]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [calendarRef, setShowCalendar]);


    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const handleSelectDate = (day, isPreviousMonth, isNextMonth) => {
        if (selectedDay === day) {
            setSelectedDate(null);
            setSelectedDay(null);
            setSelectedMonth(null);
            setSelectedYear(null);
            return;
        }

        let newDate;
        if (isPreviousMonth) {
            newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
        } else if (isNextMonth) {
            newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
        } else {
            newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        }
        setCurrentDate(newDate);
        setSelectedDate(newDate);
        setSelectedDay(day);

        const newYear = newDate.getFullYear();
        const newMonth = newDate.getMonth() + 1
        newYear != selectedYear ? setSelectedYear(newYear) : null
        newMonth != selectedMonth ? setSelectedMonth(newMonth) : null
    };

    const daysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const handleSelectedMonth = () => {
        if (selectedDay) return

        if (!selectedMonth) {
            setSelectedMonth(currentDate.getMonth() + 1)
            setSelectedYear(currentDate.getFullYear())
        } else {
            setSelectedMonth(null)
            setSelectedYear(null)
        }
    }

    const handleSelectedYear = () => {
        if (selectedDay) return

        if (selectedMonth) {
            setSelectedMonth(null)
        } else if (!selectedYear) {
            setSelectedYear(currentDate.getFullYear())
        } else {
            setSelectedYear(null)
        }
    }

    const generateDays = () => {
        const totalDays = daysInMonth(currentDate.getMonth() + 1, currentDate.getFullYear());
        const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const daysArray = [];

        if (firstDayOfWeek !== 0) {
            const prevMonthDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                daysArray.push(
                    <Col
                        key={`prev${i}`}
                        className="text-center cursor-pointer"
                        onClick={() => handleSelectDate(prevMonthDays - i, true, false)}
                        style={{ cursor: 'pointer', color: '#a1a1ab' }}
                    >
                        {prevMonthDays - i}
                    </Col>
                );
            }
        }

        for (let day = 1; day <= totalDays; day++) {
            const isSelected = selectedDate && selectedDate.getDate() === day;
            daysArray.push(
                <Col
                    key={day}
                    className={`text-center  ${isSelected ? 'bg-primary text-white' : ''}`}
                    onClick={() => handleSelectDate(day, false, false)}
                    style={{ cursor: 'pointer', }}
                >
                    {day}
                </Col>
            );
        }

        const lastDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), totalDays).getDay();
        const daysToAdd = 6 - lastDayOfWeek;

        for (let i = 1; i <= daysToAdd; i++) {
            daysArray.push(
                <Col
                    key={`next${i}`}
                    className="text-center cursor-pointer "
                    onClick={() => handleSelectDate(i, false, true)}
                    style={{ cursor: 'pointer', color: '#b9b0ab' }}
                >
                    {i}
                </Col>
            );
        }

        return daysArray;
    };

    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

    return (
        <Card ref={calendarRef} className="shadow z-3" style={{ width: 320, height: 290 }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Button variant="link fw-bold" onClick={prevMonth}>
                    {'<'}
                </Button>
                <div className="d-flex">
                    <h5 className="mb-0 text-muted">
                        <span
                            className={`${selectedMonth ? 'text-white bg-primary p-1 rounded-2' : ''}`}
                            onClick={() => handleSelectedMonth()}
                            style={{ cursor: 'pointer' }}>
                            {currentDate.toLocaleString('default', { month: 'long' })}
                        </span>
                        <span className="mx-2">de</span>
                        <span
                            className={`${selectedYear ? 'text-white bg-primary  p-1 rounded-2' : ''}`}
                            onClick={() => handleSelectedYear()}
                            style={{ cursor: 'pointer' }}
                        >
                            {currentDate.toLocaleString('default', { year: 'numeric' })}
                        </span>
                    </h5>
                </div>
                <Button variant="link fw-bold" onClick={nextMonth}>
                    {'>'}
                </Button>
            </Card.Header>
            <Card.Body className="px-2">
                <Row className=" g-0 h-100">
                    {weekDays.map((day, index) => (
                        <Col key={index} className="d-flex flex-column h-100">
                            <div className="text-center text-muted mb-2">{day}</div>
                            {generateDays().filter((item, idx) => idx % 7 === index)}
                        </Col>
                    ))}
                </Row>
            </Card.Body>
            <div className="position-absolute" style={{ bottom: "-8%", left: '11%' }}>
                <CaretDownIcon />
            </div>
        </Card>
    );
};

export default SaleIndex;