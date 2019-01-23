import React, { Component } from 'react';
import { connect } from 'react-redux';
import Post from './post';

class PostContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <div>
        {!this.props.isLoading && this.props.posts ?
          <Post
            item={this.props.posts[0]}
            isAdmin={this.props.isAdmin}
            user={this.props.user}
          />
        : <section className="page" />}
      </div>
    );
  }
}

const mapDispatchToProps = null;

const mapStateToProps = ({
  mainReducer: {
    posts,
    isAdmin,
    user
  }
}) => ({
  posts,
  isAdmin,
  user
});

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
