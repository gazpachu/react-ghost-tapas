import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { useRouterHistory } from 'react-router';
import thunk from 'redux-thunk';
import { createHistory } from 'history';
import rootReducer from './reducers/index';

const store = createStore(rootReducer, compose(applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

const browserHistory = useRouterHistory(createHistory)();

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
