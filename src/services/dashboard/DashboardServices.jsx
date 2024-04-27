import { useEffect, useState, useRef } from 'react';
import ConfirmChangesModal from '../../components/common/ConfirmChangesModal';

function DashboardServices(
    currentValues, setCurrentValues,
    prevValues, setPrevValues,
    showFormModal, setShowFormModal,
    selectedData,
    serviceRequestsFunctions, formRef,
    errorMessages, setErrorMessages, handleAPIError) {

    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [action, setAction] = useState('');
    const [confrimChangesModalData, setConfrimChangesModalData] = useState({});

    useEffect(() => {
        if (showFormModal) {
            setErrorMessages({});
            const updatedValues = Object.keys(currentValues).reduce((acc, key) => {
                acc[key] = selectedData ? selectedData[key] || '' : '';
                return acc;
            }, {});
            setCurrentValues(updatedValues);
        }

    }, [showFormModal]);


    const handleSubmit = async (e, action) => {
        e.preventDefault();

        const isValid = action !== 'delete' ? formRef.current.reportValidity() && !isEquals(prevValues, currentValues) : true;

        const actionHandlers = {
            create: { handler: handleCreate },
            update: { handler: handleUpdate },
            delete: {
                handler: () => {
                    setAction('delete');
                    setShowConfirmChangesModal(true);
                    setConfrimChangesModalData({ title: 'Deletar', message: 'Deseja realmente deletar?' });
                },
            },
        };

        if (isValid) {
            await actionHandlers[action].handler();
        }
    };


    const handleCreate = async () => {
        const response = await serviceRequestsFunctions.createFunction(currentValues);
        if (response.success) {
            Object.keys(currentValues).forEach(key => {
                currentValues[key] = '';
            });
        } else {
            handleAPIError(response);
        }
    };


    const handleUpdate = async () => {
        if (errorMessages.general || Object.keys(errorMessages).length === 0) {
            console.log('NAO TEM ERRO', errorMessages);
            setAction('update');
            setConfrimChangesModalData({ title: 'Editar', message: 'Tem certeza que deseja editar os dados?' })
            setPrevValues({});
            setShowConfirmChangesModal(true);
            console.log('TESTE,', showConfirmChangesModal)
        } else {

            console.log('TEM ERRO', errorMessages);

        }
    };


    const handleConfirmChangesModal = async () => {
        let response;
        console.log(selectedData);
        const entityId = Object.values(selectedData)[0];

        if (action === 'update') {
            response = await serviceRequestsFunctions.updateFunction(entityId, currentValues);
        } else {
            response = await serviceRequestsFunctions.deleteFunction(entityId);
        }

        if (response && response.success) {
            setShowFormModal(false);
        } else {
            handleAPIError(response);
            setShowConfirmChangesModal(false);
            setPrevValues(currentValues);
        }
    };


    const isEquals = (prevValues, currentValues) => {
        if (prevValues) {
            const keys = new Set([...Object.keys(prevValues), ...Object.keys(currentValues)]);
            const isEqual = Array.from(keys).every(key => prevValues[key] === currentValues[key]);

            if (isEqual) {
                console.log('os dados nao foram alterafdos teste')
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados.'
                }));
            }

            setPrevValues(currentValues);

            return isEqual;
        }
    };


    const renderConfirmChangesModal = () => (
        <ConfirmChangesModal
            showConfirmChangesModal={showConfirmChangesModal}
            setShowConfirmChangesModal={setShowConfirmChangesModal}
            action={action}
            handleConfirmChanges={handleConfirmChangesModal}
            confrimChangesModalData={confrimChangesModalData}
        />
    )

    return { handleSubmit, renderConfirmChangesModal };
}

export default DashboardServices;
