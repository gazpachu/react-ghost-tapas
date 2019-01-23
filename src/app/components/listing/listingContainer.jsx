import React, { Component } from 'react';
import { connect } from 'react-redux';
import Listing from './listing';
import Pagination from '../common/pagination/pagination';

class ListingContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <section className="listing">
        {!this.props.isLoading ?
          <div>
            {this.props.posts && this.props.posts.length > 0 ?
              <Listing
                items={this.props.posts}
                isAdmin={this.props.isAdmin}
                user={this.props.user}
              />
            : 'No articles found'}
          </div>
        : null}
        {!this.props.isLoading && this.props.posts && this.props.posts.length > 0 ?
          <Pagination location={this.props.historyLocation} pagination={this.props.pagination} />
        : null}
      </section>
    );
  }
}

const mapDispatchToProps = null;

const mapStateToProps = ({
  mainReducer: {
    historyLocation,
    pagination,
    posts,
    isAdmin,
    user,
    isLoading
  }
}) => ({
  historyLocation,
  pagination,
  posts,
  isAdmin,
  user,
  isLoading
});

export default connect(mapStateToProps, mapDispatchToProps)(ListingContainer);
