import React from 'react';
import  ReactDOM  from 'react-dom';
import { Provider } from 'react-redux';
import { createStore,applyMiddleware,componse, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

import App from './App';

import './index.css';

const store = createStore(reducers, compose(applyMiddleware(thunk)));
console.log(store)
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

