import React, { useState } from 'react';
import { DoubleArrowIcon } from '../../assets/icons/IconsSet';

function SortButton({ field, values, setValues, activeField, setActiveField }) {
    const [sortDirection, setSortDirection] = useState(null);

    const handleClick = () => {
        const nextDirection = field === activeField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(nextDirection);

        const sortedValues = [...values].sort((a, b) => {
            // Função para comparar strings iniciadas por letras ou números
            const compareAlphaNumeric = (valueA, valueB) => {
                // Verifica se os valores são numéricos
                const isNumeric = /^\d/.test(valueA) && /^\d/.test(valueB);
                if (isNumeric) {
                    // Converte os valores para números e compara
                    return nextDirection === 'asc' ? parseFloat(valueA) - parseFloat(valueB) : parseFloat(valueB) - parseFloat(valueA);
                } else {
                    // Se não forem numéricos, compara alfabeticamente
                    return nextDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                }
            };

            return compareAlphaNumeric(a[field], b[field]);
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
