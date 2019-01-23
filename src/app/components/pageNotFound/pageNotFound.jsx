import React, { Component } from 'react';
import Icon from '../common/lib/icon/icon';
import Error404 from '../../assets/svg/icon-404.svg';

class PageNotFound extends Component {

  componentDidMount() {
    this.props.setLoading(false);
  }

  render() {
    return (
      <section className="page not-found">
        <Icon glyph={Error404} />
        <div className="error-message">Error 404 - Page not found</div>
      </section>
    );
  }
}

export default PageNotFound;
