import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import store, { history } from './store';
import App from './components/app';
import Home from './components/home/home';
import Admin from './components/admin/admin';
import AdminPost from './components/admin/adminPost';
import PostContainer from './components/post/postContainer';
import Author from './components/author/author';
import PageNotFound from './components/pageNotFound/pageNotFound';
import './components/bundle.scss';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-00000000-1', {
    debug: false,
    titleCase: false,
    gaOptions: {
      userId: ''
    }
  });
}

function logPageView() {
  const entireUrl = window.location.href;
  if (process.env.NODE_ENV === 'production') {
    ReactGA.set({ page: entireUrl });
    ReactGA.pageview(entireUrl);
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router
      onUpdate={() => {
        window.scrollTo(0, 0);
        logPageView();
      }}
      history={history}
    >
      <Route path="/" component={App}>
        <IndexRoute component={Home} endpoint="" />
        <Route path="/admin" component={Admin} title="Admin" />
        <Route path="/admin/new" component={AdminPost} title="Admin" />
        <Route path="/admin/:id" component={AdminPost} title="Admin" />
        <Route path="/authors/:id" component={Author} title="Author" />
        <Route path="/:slug" component={PostContainer} title="" />
        <Route path="*" component={PageNotFound} title="Page not found" />
      </Route>
    </Router>
  </Provider>
, document.getElementById('react-root'));
