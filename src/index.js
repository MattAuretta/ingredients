import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

ReactDOM.render(
    // Wrap entire App in our ContextProvider so we can listen for ContextProvider anywhere
    <AuthContextProvider>
        <App />
    </AuthContextProvider>,
    document.getElementById('root')
);
