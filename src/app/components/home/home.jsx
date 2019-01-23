import React, { Component } from 'react';
import { connect } from 'react-redux';
import particles from 'particles.js';
import ListingContainer from '../listing/listingContainer';
import Customlink from '../common/lib/link/link';

class Home extends Component {

  componentDidMount() {
    this.props.setLoading(false);
    particles.particlesJS.load('particles-js', '/assets/static/particles.json', null);
  }

  render() {
    return (
      <section className="page">
        <div className="hero">
          <h1>Welcome to <Customlink to="/about">Tapas</Customlink><sup>[?]</sup></h1>
          <p>A blog system based on React.js and Ghost</p>
          {this.props.user ?
            <div className="buttons">
              <Customlink to="/admin/new" className="btn btn-secondary inverted xs">Write an article</Customlink>
              <Customlink to="/admin" className="btn btn-secondary inverted xs">My articles</Customlink>
            </div>
          : null}
        </div>
        <div id="particles-js" />
        <div className="listing">
          <ListingContainer />
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = null;

const mapStateToProps = ({
  mainReducer: {
    user
  }
}) => ({
  user
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
