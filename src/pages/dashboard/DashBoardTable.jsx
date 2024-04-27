import React from "react";
import { Table } from 'react-bootstrap';

function DashBoardTable({ data, columnName, onRowDoubleClick }) {
    console.log(data)
    console.log(columnName)
    if (!data || data.length === 0 || !columnName || columnName.length === 0) {
        return <div>Nenhum dado disponível.</div>;
    }

    const columns = Object.keys(data[0]);

    return (
        <Table responsive hover bordered>
            <thead>
                <tr>
                    {columnName.map((column, index) => (
                        <th key={index} className='bg-table-header'>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((rowData) => (
                    <tr key={rowData[columns[0]]} onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(rowData)}>
                        {columns.map((column, index) => (
                            index !== 0 && <td key={index}>{rowData[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default DashBoardTable;
