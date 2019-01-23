/* eslint no-return-assign: "off" */
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import debounce from 'lodash/debounce';
import { connect } from 'react-redux';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import {
  changeViewport,
  locationDidUpdate,
  setLoading
} from '../actions/actions';
import Helpers from './common/helpers';
import ApiHelpers from './common/apiHelpers';
import { history } from '../store';
import { APP_NAME } from '../constants/constants';
import Notification from './common/notification/notification';
import TopNav from './common/topnav/topnav';
import Authentication from './common/authentication/authentication';
import Loader from './common/loader/loader';
import CustomLink from './common/lib/link/link';

class App extends Component {

  static updateBodyClass(location) {
    // Update the body class dynamically with the path names
    const body = document.querySelector('body');
    const pathname = location.pathname.charAt(0) === '/' ? location.pathname.substring(1) : location.pathname;
    let bodyClasses = Helpers.classify(pathname) || 'home';
    bodyClasses = bodyClasses.split(' ');
    body.className = '';
    bodyClasses.forEach((el) => {
      body.classList.add(el);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      fetchWhenReady: true
    };
  }

  componentWillMount() {
    // ApiHelpers.login();
    ApiHelpers.loadPages();
  }

  componentDidMount() {
    let isDesktop = window.innerWidth > 768;
    this.props.changeViewport(isDesktop);

    window.onresize = debounce(() => {
      isDesktop = window.innerWidth > 768;
      this.props.changeViewport(isDesktop);
    }, 500);

    OfflinePluginRuntime.install({
      onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
      onUpdated: () => (window.swUpdate = true)
    });

    this.unlisten = history.listen((location) => {
      this.setState({ fetchWhenReady: true }, () => {
        this.props.locationDidUpdate(location);
      });
      App.updateBodyClass(location);
    });

    this.props.locationDidUpdate(this.props.location);
    App.updateBodyClass(this.props.location);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.fetchWhenReady && newProps.apiReady && !newProps.isFetching && newProps.historyLocation) {
      this.setState({ fetchWhenReady: false }, () => {
        ApiHelpers.loadData(this.props.historyLocation, newProps.user);
      });
    }
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const title = this.props.routes[1].title
      ? `${this.props.routes[1].title} | ${APP_NAME}`
      : `${APP_NAME}`;

    return (
      <section className="app">
        <Helmet title={String(title)} />
        <Loader isLoading={this.props.isLoading} />
        <TopNav location={this.props.location} />
        <Notification />
        <Authentication />
        {React.cloneElement(this.props.children, this.props)}
        <footer id="footer" className="footer">
          <div className="footer-content">
            React Ghost v1.0.0 | Made with ♥ by Vodafone for the OS Community | <CustomLink to="/about">About</CustomLink>
          </div>
        </footer>
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    apiReady,
    isDesktop,
    isLoading,
    isFetching,
    historyLocation,
    user
  }
}) => ({ apiReady, isDesktop, isLoading, isFetching, historyLocation, user });

const mapDispatchToProps = {
  changeViewport,
  setLoading,
  locationDidUpdate
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
