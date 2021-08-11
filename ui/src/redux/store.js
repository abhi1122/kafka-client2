import React, { createContext, useReducer } from 'react';

const initialState = { topics: {}, selectedTopics: {}, loading: false, isLogin: false };
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((stateData, action) => {
        switch (action.type) {
            case 'UPDATE_TOPICS':
                console.log('action call.............');
                // const newState = state;
                return { ...stateData, topics: action.payload };
            case 'UPDATE_SELECTED_TOPICS':
                return { ...stateData, selectedTopics: action.payload, selectedTopicsNames: Object.keys(action.payload) };
            case 'UPDATE_LOADING_STATUS':
                return { ...stateData, loading: action.payload };
            case 'UPDATE_LOGIN_STATUS':
                return { ...stateData, isLogin: action.payload };
            default:
                return stateData;
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }