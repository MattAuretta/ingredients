import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentState, action) => {
  switch (action.type) {
    // Override current ingredients with a new array of ingredients
    case 'SET':
      return action.ingredients;

    // Add an ingredient to the current state
    case 'ADD':
      return [...currentState, action.ingredient]

    // Remove an ingredient from the current state
    case 'DELETE':
      return currentState.filter(ingredient => ingredient.id !== action.id)
    
    default:
      throw new Error (`Missing type in ingredientReducer: ${action.type}`)
  }
}

const Ingredients = () => {
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, []);
  // const [ingredientsState, setIngredientsState] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  // useCallback allows React to cache the function so it survives re-render cycles. 
  // This causes the function not to change and prevents infinite loops.
  const filteredIngredientsHandler = useCallback((ingredients) => {
    // setIngredientsState(ingredients);
    dispatch({
      type: 'SET',
      ingredients: ingredients
    });
  }, []);

  const addIngredientHandler = (ingredient) => {
    setLoadingState(true);
    fetch('https://react-hooks-1d6ad.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setLoadingState(false);
        return response.json();
      })
      .then(responseData => {
        // setIngredientsState(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: {id: responseData.name, ...ingredient}
        });
      })
      .catch(error => {
        // Both state updates are batched together and executed synchronously in one render cycle.
        setErrorState(error.message);
        setLoadingState(false);
      });
  }

  const removeIngredientHandler = (id) => {
    setLoadingState(true);
    fetch(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    })
      .then(response => {
        setLoadingState(false);
        // setIngredientsState(prevIngredients => prevIngredients.filter(item => item.id !== id))
        dispatch({
          type: 'DELETE',
          id: id
        });
      })
      .catch(error => {
        // Both state updates are batched together and executed synchronously in one render cycle.
        setErrorState(error.message);
        setLoadingState(false);
      });
  }

  const resetErrorMessageHandler = () => {
    setErrorState(null);
  }

  return (
    <div className="App">
      {errorState && <ErrorModal onClose={resetErrorMessageHandler}>{errorState}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={loadingState}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={ingredientsState}
          onRemoveItem={removeIngredientHandler}
        />
        {/* Need to add list here! */}
      </section>
    </div>
  );
}

export default Ingredients;
