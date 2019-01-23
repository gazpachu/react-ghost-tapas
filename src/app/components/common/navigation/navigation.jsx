import React, { Component } from 'react';
import { connect } from 'react-redux';
import CustomLink from '../lib/link/link';

class Navigation extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <nav id="navigation" className="navigation">
        <div id="sidenav" className="sidenav">
          <div className="nav-scroll">
            <ul className="nav-items">
              <li className="nav-item">
                <CustomLink to="/" onClick={this.props.toggleNav}>Home page</CustomLink>
              </li>
              {this.props.user ?
                <li className="nav-item">
                  <CustomLink to="/admin/new" onClick={this.props.toggleNav}>Write an article</CustomLink>
                </li>
              : null}
              {this.props.user ?
                <li className="nav-item">
                  <CustomLink to="/admin" onClick={this.props.toggleNav}>My articles</CustomLink>
                </li>
              : null}
              {this.props.pages.map(item => (<li className="nav-item" key={item.id}>
                <CustomLink to={item.slug} onClick={this.props.toggleNav}>{item.title}</CustomLink>
              </li>)
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    pages,
    user
  }
}) => ({ pages, user });

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
