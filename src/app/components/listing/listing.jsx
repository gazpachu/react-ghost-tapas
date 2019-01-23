import React, { Component } from 'react';
import Moment from 'moment';
import Customlink from '../common/lib/link/link';
import Icon from '../common/lib/icon/icon';
import Avatar from '../../assets/svg/avatar.svg';
import Edit from '../../assets/svg/edit.svg';

class Listing extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <ul className="items">
        {this.props.items ?
          this.props.items.map(item =>
          (<li key={item.id} className="item">
            <Customlink to={item.slug}>
              <h2>{item.title}</h2>
            </Customlink>
            <Customlink to={item.slug}>
              {item.feature_image ?
                <img className="featured-image" src={item.feature_image} alt={item.title} />
              : <div className="featured-image listing-thumb photo-image" />}
            </Customlink>
            {item.html ?
              <div className="excerpt"><span dangerouslySetInnerHTML={{ __html: item.html.substring(0, 450).replace(/<(?:.|\n)*?>/gm, '') }} />... <Customlink to={item.slug} className="read-more">read more</Customlink></div>
            : null}
            {item.author.profile_image
              ? <img className="avatar" alt="" src={item.author.profile_image} />
              : <Icon glyph={Avatar} className="icon avatar" />}
            <span className="date">Published on {Moment(item.published_at).format('MMM D, YYYY')} by <Customlink to={`authors/${item.author.slug}`}>{item.author.name}</Customlink></span>
            {(this.props.isAdmin || (this.props.user && this.props.user.id === item.author.id)) ?
              <Customlink to={`/admin/${item.id}`}><Icon glyph={Edit} />Edit post</Customlink>
            : null}
          </li>)
          )
        : null}
      </ul>
    );
  }
}

export default Listing;
