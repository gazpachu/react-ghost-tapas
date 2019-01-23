import React, { Component } from 'react';
import Moment from 'moment';
import { history } from '../../store';
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Sorting from '../../assets/svg/icon-arrow-sorting.svg';

class AdminListing extends Component {

  static loadPost(id) {
    history.push(`/admin/${id}`);
  }

  constructor(props) {
    super(props);

    this.state = {
      activeSortField: '',
      reverseSort: false
    };

    this.sortBy = this.sortBy.bind(this);
  }

  sortBy(type) {
    const {
      props: { posts, pageSize, offset },
      state: { reverseSort }
    } = this;

    this.setState({
      activeSortField: type,
      reverseSort: !reverseSort
    }, () => {
      Helpers.sortBy({
        activeSortField: type,
        data: posts,
        reverse: reverseSort
      });

      this.props.setData(posts.slice(offset, offset + pageSize));
    });
  }

  render() {
    const {
      sortBy,
      state: {
        reverseSort,
        activeSortField
      }
    } = this;

    return (

      <table className="items">
        <thead>
          <tr>
            <th className="mobile-hidden">
              <button
                className={`sort ${reverseSort && activeSortField === 'author' ? 'reverse' : ''} ${activeSortField === 'author' ? 'active' : ''}`}
                onClick={() => sortBy('author')}
              >
                Author <Icon glyph={Sorting} className="icon sorting" />
              </button>
            </th>
            <th className="mobile-hidden">
              <button
                className={`sort ${reverseSort && activeSortField === 'created_at' ? 'reverse' : ''} ${activeSortField === 'created_at' ? 'active' : ''}`}
                onClick={() => sortBy('created_at')}
              >
                Created on <Icon glyph={Sorting} className="icon sorting" />
              </button>
            </th>
            <th>
              <button
                className={`sort ${reverseSort && activeSortField === 'status' ? 'reverse' : ''} ${activeSortField === 'status' ? 'active' : ''}`}
                onClick={() => sortBy('status')}
              >
                Status <Icon glyph={Sorting} className="icon sorting" />
              </button>
            </th>
            <th className="mobile-hidden">
              <button
                className={`sort ${reverseSort && activeSortField === 'page' ? 'reverse' : ''} ${activeSortField === 'page' ? 'active' : ''}`}
                onClick={() => sortBy('page')}
              >
                Type <Icon glyph={Sorting} className="icon sorting" />
              </button>
            </th>
            <th>
              <button
                className={`sort ${reverseSort && activeSortField === 'title' ? 'reverse' : ''} ${activeSortField === 'title' ? 'active' : ''}`}
                onClick={() => sortBy('title')}
              >
                Title <Icon glyph={Sorting} className="icon sorting" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.props.data ?
            this.props.data.map(item =>
            ((this.props.isAdmin || (this.props.user && this.props.user.id === item.author.id)) ?
              <tr key={item.id} className="item" role="button" onClick={() => AdminListing.loadPost(item.id)}>
                <td className="mobile-hidden">
                  {item.author.name}
                </td>
                <td className="mobile-hidden">
                  {Moment(item.created_at).format('MMM D, YYYY')}
                </td>
                <td>
                  <span className={`status ${item.status}`}>{item.status}</span>
                </td>
                <td className="mobile-hidden">
                  <span className={`type ${item.page ? 'page' : 'post'}`}>{item.page ? 'Page' : 'Post'}</span>
                </td>
                <td>
                  <h2>{item.title}</h2>
                </td>
              </tr>
            : null))
          : null}
        </tbody>
      </table>
    );
  }
}

export default AdminListing;
