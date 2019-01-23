import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListingContainer from '../listing/listingContainer';
import Icon from '../common/lib/icon/icon';
import Avatar from '../../assets/svg/avatar.svg';

class Author extends Component {

  componentDidMount() {
    this.props.setLoading(false);
  }

  render() {
    return (
      <section className="page">
        {this.props.user ?
          <div className="author-meta">
            <h1>Articles by {this.props.user.name}</h1>
            {this.props.user.profile_image
              ? <img className="avatar" alt="" src={this.props.user.profile_image} />
              : <Icon glyph={Avatar} className="icon avatar" />}
            <a href={`mailto:${this.props.user.email}?subject=Tapas`}>{this.props.user.email}</a>
          </div>
        : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(Author);
