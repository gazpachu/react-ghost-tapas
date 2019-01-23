import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import AdminListing from './adminListing';

class AdminListingContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pageSize: 10,
      offset: 0,
      pageCount: 0
    };

    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { posts } = newProps;
    const { pageSize } = this.state;

    if (posts) {
      this.setState({
        data: posts.slice(0, pageSize),
        pageCount: Math.ceil(posts.length / pageSize)
      });
    } else {
      this.setState({ data: [], pageCount: 0 });
    }
  }

  handlePageClick(data) {
    const {
      props: { posts },
      state: { pageSize }
    } = this;
    const selected = data.selected;
    const offset = Math.ceil(selected * pageSize);

    this.setState({
      offset,
      data: posts.slice(offset, offset + pageSize)
    });
  }

  render() {
    return (
      <section className="admin-listing">
        <AdminListing
          pageSize={this.state.pageSize}
          pageCount={this.state.pageCount}
          posts={this.props.posts}
          data={this.state.data}
          offset={this.state.offset}
          setData={data => this.setState({ data })}
          user={this.props.user}
          isAdmin={this.props.isAdmin}
        />
        <div className="pagination-wrapper">
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={<span> ...</span>}
            breakClassName={'break-me'}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = null;

const mapStateToProps = ({
  mainReducer: {
    posts,
    user,
    isAdmin
  }
}) => ({
  posts,
  isAdmin,
  user
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminListingContainer);
