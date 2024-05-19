import React from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange, setItemsPerPage }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        onPageChange(pageNumber);
    };

    const calculatePageRange = () => {
        const pagesPerSet = 5;
        const currentSet = Math.ceil(currentPage / pagesPerSet);
        const startPage = (currentSet - 1) * pagesPerSet + 1;
        let endPage = startPage + pagesPerSet - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
        }
        return { startPage, endPage };
    };

    const { startPage, endPage } = calculatePageRange();

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <div className="d-flex justify-content-end gap-2">
                <select class="form-select form-select-sm w-auto h-50 mt-1" aria-label="Registros por página"
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                >
                    <option disabled selected>Registros por página</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="24">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <ul className="pagination">
                    <li className={"page-item " + (currentPage === 1 ? "disabled" : "")}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Anterior</button>
                    </li>
                    {startPage > 1 && <li className="page-item"><button className="page-link" onClick={() => handlePageChange(1)}>1</button></li>}
                    {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                    {pageNumbers.map(number => (
                        <li key={number} className={"page-item " + (currentPage === number ? "active" : "")}>
                            <button className="page-link" onClick={() => handlePageChange(number)}>{number}</button>
                        </li>
                    ))}
                    {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
                    {endPage < totalPages && <li className="page-item"><button className="page-link" onClick={() => handlePageChange(totalPages)}>{totalPages}</button></li>}
                    <li className={"page-item " + (currentPage === totalPages ? "disabled" : "")}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Próximo</button>
                    </li>
                </ul>
            </div>
            <p className="text-end text-muted">Há um total de {totalItems} registros na tabela</p>
        </>
    );
}

export default Pagination;
