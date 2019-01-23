import React, { Component } from 'react';
import Moment from 'moment';
import { history } from '../../../store';
import Icon from '../../common/lib/icon/icon';
import SearchIcon from '../../../assets/svg/search.svg';
import CloseIcon from '../../../assets/svg/x.svg';
import ApiHelpers from '../apiHelpers';
import CustomLink from '../lib/link/link';

class SearchBox extends Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: '',
      opened: false,
      searching: false,
      postsFound: []
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    if (this.state.opened) {
      this.searchInput.focus();
    }
  }

  handleChange(event) {
    this.setState({ keyword: event.target.value, searching: true }, () => {
      let postsFound = [];

      if (this.state.keyword.length > 3) {
        const req = ApiHelpers.search();
        req.then((response) => {
          // Search on titles or authors
          postsFound = response.data.posts.filter(o => o.title.toLowerCase().includes(this.state.keyword) || o.author.name.toLowerCase().includes(this.state.keyword));
          this.setState({ postsFound, searching: false });
        });
      } else {
        this.setState({ searching: false });
      }
      this.setState({ postsFound });
    });
  }

  loadPost(id) {
    this.setState({ opened: false });
    history.push(`/${id}`);
  }

  render() {
    return (
      <div className="search-box">
        <button className="search" onClick={() => this.setState({ opened: !this.state.opened })}>
          <Icon glyph={SearchIcon} />
        </button>
        <div className={`overlay ${this.state.opened ? 'fade-in' : 'fade-out'}`} />
        {this.state.opened ?
          <div className="search-overlay">
            <button className="close" onClick={() => this.setState({ opened: false })}>
              <Icon glyph={CloseIcon} />
            </button>
            <input type="text" placeholder="Search" name="q" ref={(input) => { this.searchInput = input; }} className="keywords" value={this.state.keyword} onChange={this.handleChange} />
            {this.state.searching ? <div className="loader-small inverted" /> : null}
            <div className="search-results">
              <ul className="found-items">
                {this.state.postsFound.map(item => (<li key={item.id} role="button" onClick={() => this.loadPost(item.slug)}>
                  <CustomLink to={item.slug}>
                    {item.feature_image ?
                      <img className="featured-image" src={item.feature_image} alt={item.title} />
                    : <div className="featured-image listing-thumb photo-image" />}
                  </CustomLink>
                  <CustomLink to={item.slug} onClick={() => this.setState({ opened: false })}>{item.title} <span>by {item.author.name} on {Moment(item.published_at).format('MMM D, YYYY')}</span></CustomLink>
                </li>))}
              </ul>
            </div>
          </div>
        : null}
      </div>
    );
  }
}

export default SearchBox;
