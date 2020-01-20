import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props; // Functions are objects and behave like any other value
  const [filterState, setFilterState] = useState('');
  const inputRef = useRef();

  const { data, error, loading, sendRequest, resetError } = useHttp();

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

        sendRequest(`https://react-hooks-1d6ad.firebaseio.com/ingredients.json${queryParams}`, 'GET');
      }
    }, 500);
    // Clean up function that will run right before this useEffect is called again. 
    // This will clear our timer so we don't have a timeout running per keystroke.
    return () => {
      clearTimeout(timer);
    }
  }, [filterState, inputRef, sendRequest]);

  useEffect(() => {
    if (!loading && !error && data) {
      const loadedIngredients = [];
      for (let key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      props.onLoadIngredients(loadedIngredients);
    }
  }, [data, error, loading, onLoadIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={resetError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading...</span>}
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
