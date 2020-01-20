import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (ingredientState, action) => {
  switch (action.type) {
    case 'SET':     // Override current ingredients with a new array of ingredients
      return action.ingredients;
    case 'ADD':     // Add an ingredient to the current state
      return [...ingredientState, action.ingredient];
    case 'DELETE':  // Remove an ingredient from the current state
      return ingredientState.filter(ingredient => ingredient.id !== action.id)
    default:
      throw new Error(`Missing type in ingredientReducer: ${action.type}`);
  }
}

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case 'REQUEST':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false }; // Using the spread operator to merge in new changes to our state object
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'RESET':
      return { ...httpState, error: null };
    default:
      throw new Error(`Missing type in ingredientReducer: ${action.type}`);
  }
}

const Ingredients = () => {
  const [ingredientsState, ingredientsDispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null });

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  // useCallback allows React to cache the function so it survives re-render cycles. 
  // This causes the function not to change and prevents infinite loops.
  const filteredIngredientsHandler = useCallback((ingredients) => {
    ingredientsDispatch({
      type: 'SET',
      ingredients: ingredients
    });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    httpDispatch({ type: 'REQUEST' });

    fetch('https://react-hooks-1d6ad.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        httpDispatch({ type: 'RESPONSE' });
        return response.json();
      })
      .then(responseData => {
        ingredientsDispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient }
        });
      })
      .catch(error => {
        httpDispatch({
          type: 'ERROR',
          error: error.message
        });
      });
  }, []);

  const removeIngredientHandler = useCallback((id) => {
    httpDispatch({ type: 'REQUEST' });

    fetch(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    })
      .then(response => {
        httpDispatch({ type: 'RESPONSE' });

        ingredientsDispatch({
          type: 'DELETE',
          id: id
        });
      })
      .catch(error => {
        httpDispatch({
          type: 'ERROR',
          error: error.message
        });
      });
  }, []);

  const resetErrorMessageHandler = useCallback(() => {
    httpDispatch({ type: 'RESET' });
  }, []);

  // With useMemo you can store any data that you don't want to re-create on every re-render cycle
  // Typically you would want to use React.memo to store components instead of useMemo
  const ingredietList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredientsState}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredientsState, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={resetErrorMessageHandler}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredietList}
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
