import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (ingredientState, action) => {
  switch (action.type) {
    // Override current ingredients with a new array of ingredients
    case 'SET':
      return action.ingredients;

    // Add an ingredient to the current state
    case 'ADD':
      return [...ingredientState, action.ingredient];

    // Remove an ingredient from the current state
    case 'DELETE':
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
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null });
  // const [ingredientsState, setIngredientsState] = useState([]);
  // const [loadingState, setLoadingState] = useState(false);
  // const [errorState, setErrorState] = useState(null);

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
    // setLoadingState(true);
    httpDispatch({ type: 'REQUEST' });

    fetch('https://react-hooks-1d6ad.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        // setLoadingState(false);
        httpDispatch({ type: 'RESPONSE' });
        return response.json();
      })
      .then(responseData => {
        // setIngredientsState(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({
          type: 'ADD',
          ingredient: { id: responseData.name, ...ingredient }
        });
      })
      .catch(error => {
        // Both state updates are batched together and executed synchronously in one render cycle.
        // setErrorState(error.message);
        // setLoadingState(false);

        httpDispatch({
          type: 'ERROR',
          error: error.message
        });

      });
  }

  const removeIngredientHandler = (id) => {
    // setLoadingState(true);
    httpDispatch({ type: 'REQUEST' });

    fetch(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    })
      .then(response => {
        // setLoadingState(false);
        httpDispatch({ type: 'RESPONSE' });

        // setIngredientsState(prevIngredients => prevIngredients.filter(item => item.id !== id))
        dispatch({
          type: 'DELETE',
          id: id
        });
      })
      .catch(error => {
        // Both state updates are batched together and executed synchronously in one render cycle.
        // setErrorState(error.message);
        // setLoadingState(false);

        httpDispatch({
          type: 'ERROR',
          error: error.message
        });
      });
  }

  const resetErrorMessageHandler = () => {
    httpDispatch({ type: 'RESET' });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={resetErrorMessageHandler}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
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
