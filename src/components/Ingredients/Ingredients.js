import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [ingredientsState, setIngredientsState] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  const filteredIngredientsHandler = useCallback((ingredients) => {
    setIngredientsState(ingredients);
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
        setIngredientsState(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      })
      .catch(error => {
        // Both state updates are batched together and executed synchronously in one render cycle.
        setErrorState(error.message);
        setLoadingState(false);
      });
  }

  const removeIngredientHandler = (id) => {
    setLoadingState(true);
    fetch(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.jon`, {
      method: 'DELETE'
    })
      .then(response => {
        setLoadingState(false);
        setIngredientsState(prevIngredients => prevIngredients.filter(item => item.id !== id))
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
