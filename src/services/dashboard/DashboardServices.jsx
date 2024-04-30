import { useEffect, useState, useRef } from 'react';
import ConfirmChangesModal from '../../components/common/ConfirmChangesModal';

function CommonDashboardServices(
    currentValues, setCurrentValues,
    prevValues, setPrevValues,
    showFormModal, setShowFormModal,
    selectedData,
    serviceRequestsFunctions, formRef,
    errorMessages, setErrorMessages, handleAPIError) {

    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);
    const [action, setAction] = useState('');
    const [confirmChangesModalData, setConfirmChangesModalData] = useState({});

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
                    setConfirmChangesModalData({ title: 'Deletar', message: 'Deseja realmente deletar?' });
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
            setAction('update');
            setConfirmChangesModalData({ title: 'Editar', message: 'Tem certeza que deseja editar os dados?' })
            setPrevValues({});
            setShowConfirmChangesModal(true);
        } 
    };


    const handleConfirmChangesModal = async () => {
        let response;
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
                setErrorMessages(prevErrors => ({
                    ...prevErrors, general: 'Os dados não foram alterados.'
                }));
            }

            setPrevValues(currentValues);

            return isEqual;
        }
    };

    
    renderConfirmChangesModal(showConfirmChangesModal, setShowConfirmChangesModal, handleConfirmChangesModal, confirmChangesModalData);

    return { handleSubmit, renderConfirmChangesModal };
}


function userDashBoardServices(currentValues, setPrevValues, serviceRequests, setShowModal, setErrorMessages, handleAPIError){
    const [showConfirmChangesModal, setShowConfirmChangesModal] = useState(false);

    const handleSubmit = () =>{
        if (prevSelectedValues.role === currentValues.role) {
            setErrorMessages({ role: 'O usuário já possuí o cargo selecionado' })
            return;
        }else{
            showConfirmChangesModal(true);
        }

        setPrevValues(currentValues.role);
    }

    
    const handleConfirmChangesModal = async () => {
        const response = await serviceRequests.changeRole(currentValues.userId, currentValues.role);
        if (response.success) {
            setShowConfirmChangesModal(false);
            setShowModal(false);
        }else{
            handleAPIError(response);
            setShowConfirmChangesModal(false);
        }
    }


    renderConfirmChangesModal(showConfirmChangesModal, setShowConfirmChangesModal, handleConfirmChangesModal, { title: 'Editar', message: 'Tem certeza que deseja editar os dados?' } )

    return {handleSubmit, renderConfirmChangesModal}
}


const renderConfirmChangesModal = (showConfirmChangesModal, setShowConfirmChangesModal, handleConfirmChangesModal, confirmChangesModalData) => (
    <ConfirmChangesModal
        showConfirmChangesModal={showConfirmChangesModal}
        setShowConfirmChangesModal={setShowConfirmChangesModal}
        handleConfirmChanges={handleConfirmChangesModal}
        confirmChangesModalData={confirmChangesModalData}
    />
)


export { CommonDashboardServices, userDashBoardServices};