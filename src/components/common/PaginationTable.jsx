import React from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
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
        <div className="d-flex justify-content-end">
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
    );
}

export default Pagination;
