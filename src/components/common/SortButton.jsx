import React, { useState } from 'react';
import { DoubleArrowIcon } from '../../assets/icons/IconsSet';

function SortButton({ field, values, setValues, activeField, setActiveField }) {
    const [sortDirection, setSortDirection] = useState(null);

    const handleClick = () => {
        const nextDirection = field === activeField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(nextDirection);

        const sortedValues = [...values].sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];

            // Função para comparar strings iniciadas por letras, números ou datas
            const compareAlphaNumeric = (valueA, valueB) => {
                // Verifica se os valores são datas no formato "DD/MM/YYYY"
                const isDate = (str) => /^\d{2}\/\d{2}\/\d{4}$/.test(str);

                const parseDate = (str) => {
                    const [day, month, year] = str.split('/').map(Number);
                    return new Date(year, month - 1, day); // mês começa em 0 no objeto Date
                };

                if (isDate(valueA) && isDate(valueB)) {
                    // Converte os valores para objetos Date e compara
                    const dateA = parseDate(valueA);
                    const dateB = parseDate(valueB);
                    return nextDirection === 'asc' ? dateA - dateB : dateB - dateA;
                } 

                const isNumeric = /^\d/.test(valueA) && /^\d/.test(valueB);
                if (isNumeric) {
                    // Converte os valores para números e compara
                    return nextDirection === 'asc' ? parseFloat(valueA) - parseFloat(valueB) : parseFloat(valueB) - parseFloat(valueA);
                } else {
                    // Se não forem numéricos ou datas, compara alfabeticamente
                    return nextDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                }
            };

            return compareAlphaNumeric(valueA, valueB);
        });

        setValues(sortedValues);
        setActiveField(field);
    };

    const colorUp = activeField === field && sortDirection === 'desc' ? "#FFFF00" : "#0F0F0F";
    const colorDown = activeField === field && sortDirection === 'asc' ? "#CD0C00" : "#0F0F0F";

    return (
        <a type='button' onClick={handleClick}>
            <DoubleArrowIcon colorUp={colorUp} colorDown={colorDown} />
        </a> 
    );
}

export default SortButton;
