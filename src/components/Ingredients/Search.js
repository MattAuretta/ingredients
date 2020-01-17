import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props; // Functions are objects and behave like any other value
  const [filterState, setFilterState] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    // Create a timeout to avoid sending a request every keystroke
    const timer = setTimeout(() => {
      // Compare the filterState to the current value of the input, otherwise we still send a request every keystroke, just delayed.
      if (filterState === inputRef.current.value) {
        let queryParams;
        if (filterState.length === 0) {
          queryParams = '';
        } else {
          queryParams = `?orderBy="title"&equalTo="${filterState}"`;
        }

        fetch(`https://react-hooks-1d6ad.firebaseio.com/ingredients.json${queryParams}`)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (let key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            props.onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    // Clean up function that will run right before this useEffect is called again. 
    // This will clear our timer so we don't have a timeout running per keystroke.
    return () => {
      clearTimeout(timer);
    }
  }, [filterState, onLoadIngredients, inputRef]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={filterState}
            onChange={event => setFilterState(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
