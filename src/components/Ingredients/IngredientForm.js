import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  const [titleState, setTitleState] = useState('');
  const [amountState, setAmountState] = useState('');
  console.log('RENDERING INGREDIENT FORM');

  useEffect(() => {
    if (props.editFields) {
      setTitleState(props.editFields.title);
      setAmountState(props.editFields.amount);
    }
  }, [props.editFields])

  const addIngredientHandler = event => {
    event.preventDefault();
    props.onAddIngredient({
      title: titleState,
      amount: amountState
    });
  };

  const editIngredientHandler = event => {
    event.preventDefault();
    props.onEditIngredient({
      title: titleState,
      amount: amountState
    }, props.editFields.id);
  };

  return (
    <section className="ingredient-form">
      <Card>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={titleState}
              onChange={event => {
                setTitleState(event.target.value)
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amountState}
              onChange={event => {
                setAmountState(event.target.value)
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            {props.editFields ? <button onClick={editIngredientHandler}>Edit Ingredient</button> : <button onClick={addIngredientHandler}>Add Ingredient</button>}
            {props.loading && <LoadingIndicator />}
          </div>
      </Card>
    </section>
  );
});

export default IngredientForm;
