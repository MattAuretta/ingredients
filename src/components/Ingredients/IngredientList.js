import React from 'react';

import EditModal from '../UI/EditModal';
import './IngredientList.css';

const IngredientList = React.memo(props => {
  return (
    <section className="ingredient-list">
      {props.editState.inUse && <EditModal onClose={props.resetEdit} editFields={props.editState}></EditModal>}
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id}>
            <span>{ig.title}</span>
            <span>{ig.amount}</span>
            <span style={{ color: '#EC961E', cursor: 'pointer' }} onClick={props.onEdit.bind(this, ig.id, ig.title, ig.amount)}>Edit</span>
            <span style={{ color: 'red', cursor: 'pointer' }} onClick={props.onRemoveItem.bind(this, ig.id)}>X</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default IngredientList;
