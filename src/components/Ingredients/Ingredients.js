import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [ingredientsState, setIngredientsState] = useState([]);

  // This is no longer needed, since Search.js sets our state with props.onLoadIngredients
  // useEffect(() => {
  //   fetch('https://react-hooks-1d6ad.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       console.log(responseData);
  //       const loadedIngredients = [];
  //       for (let key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       setIngredientsState(loadedIngredients);
  //     });
  // }, []);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredientsState)
  }, [ingredientsState]);

  const filteredIngredientsHandler = useCallback((ingredients) => {
    setIngredientsState(ingredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-1d6ad.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(responseData => {
      setIngredientsState(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ]);
    });
  }

  const removeIngredientHandler = (id) => {
    fetch(`https://react-hooks-1d6ad.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    })
    .then(response => {
      setIngredientsState(prevIngredients => prevIngredients.filter(item => item.id !== id))
    });
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

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
