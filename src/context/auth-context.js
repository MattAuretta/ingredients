import React, {useState} from 'react';

// Create context object
export const AuthContext = React.createContext({
    isAuth: false,
    login: () => {}
});

const AuthContextProvider = props => {
    const [authState, setAuthState] = useState(false);

    // Assign authState to true when a user logs in
    const loginHandler = () => {
        setAuthState(true);
    }

    return (
        // Allow anything to be passed into AuthContext and use authState and login function as values
        <AuthContext.Provider value={{isAuth: authState, login: loginHandler}}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;