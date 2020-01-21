import React, {useCallback} from 'react';

import sendRequest from '../../hooks/http';
import IngredientForm from '../Ingredients/IngredientForm';
import './EditModal.css';

const EditModal = props => {
    const body = {
        title: props.editFields.title,
        amount: props.editFields.amount
    }

    const id = props.editFields.id;

    const editIngredientHandler = useCallback(() => {
        sendRequest(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.json`, 'PUT', body, null, null);
    }, [body, id]);

    return (
        <React.Fragment>
            <div className="backdrop" onClick={props.onClose} />
            <div className="edit-modal">
                <h2>Edit</h2>
                <div className="edit-modal__actions">

                    <IngredientForm
                        editFields={props.editFields}
                        onEditIngredient={editIngredientHandler}
                    />

                    <button type="button" onClick={props.onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};

export default EditModal;
