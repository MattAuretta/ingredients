import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

import useHttp from '../../hooks/http';

const ingredientReducer = (ingredientState, action) => {
  switch (action.type) {
    case 'SET':     // Override current ingredients with a new array of ingredients
      return action.ingredients;
    case 'ADD':     // Add an ingredient to the current state
      return [...ingredientState, action.ingredient];
    case 'DELETE':  // Remove an ingredient from the current state
      console.log("DELETE")
      return ingredientState.filter(ingredient => ingredient.id !== action.id)
    default:
      throw new Error(`Missing type in ingredientReducer: ${action.type}`);
  }
}

const Ingredients = () => {
  const [ingredientsState, ingredientsDispatch] = useReducer(ingredientReducer, []);
  const { data, error, id, ingredient, loading, resetError, sendRequest } = useHttp();

  useEffect(() => {
    if (id && !error) {
      ingredientsDispatch({ type: 'DELETE', id: id });
    } else if (ingredient && data && !error) {
      ingredientsDispatch({
        type: 'ADD',
        ingredient: { id: data.name, ...ingredient }
      });
    }
  }, [data, id, ingredient]);

  // useCallback allows React to cache the function so it survives re-render cycles. 
  // This causes the function not to change and prevents infinite loops.
  const filteredIngredientsHandler = useCallback((ingredients) => {
    ingredientsDispatch({
      type: 'SET',
      ingredients: ingredients
    });
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest('https://react-hooks-1d6ad.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), null, ingredient);
  }, [sendRequest]);

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, id, null);
  }, [sendRequest]);

  const resetErrorMessageHandler = useCallback(() => {
    resetError();
  }, [resetError]);

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
      {error && <ErrorModal onClose={resetErrorMessageHandler}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loading}
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
