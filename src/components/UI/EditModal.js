import React from 'react';

import IngredientForm from '../Ingredients/IngredientForm';
import './EditModal.css';

const EditModal = props => {
    return (
        <React.Fragment>
            <div className="backdrop" onClick={props.onClose} />
            <div className="edit-modal">
                <h2>Edit</h2>
                <div className="edit-modal__actions">

                    <IngredientForm
                        editFields={props.editFields}
                        onEditIngredient={props.onEditIngredient}
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
