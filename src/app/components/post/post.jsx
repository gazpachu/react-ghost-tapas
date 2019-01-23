import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Moment from 'moment';
import debounce from 'lodash/debounce';
import ScrollProgress from 'scrollprogress';
import Customlink from '../common/lib/link/link';
import * as CONSTANTS from '../../constants/constants';
import Icon from '../common/lib/icon/icon';
import Edit from '../../assets/svg/edit.svg';
import Avatar from '../../assets/svg/avatar.svg';

class Post extends Component {

  constructor(props) {
    super(props);

    this.state = {
      progress: 0
    };
  }

  componentDidMount() {
    this.debounced = debounce(() => {
      if (this.progressObserver) {
        // eslint-disable-next-line
        this.progressObserver._onResize();
      }
    }, 500);

    window.addEventListener('scroll', this.debounced);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.item && !this.progressObserver) {
      this.progressObserver = new ScrollProgress((x, y) => {
        this.setState({ progress: y * 100 });
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.debounced);
    if (this.progressObserver) {
      this.progressObserver.destroy();
    }
  }

  render() {
    const { item } = this.props;
    const style = {
      backgroundColor: '#48fcff',
      height: '5px',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 12,
      width: `${this.state.progress}%`
    };

    return (
      <section className={`post page ${item && item.page ? 'is-page' : ''}`}>
        <div className="progress-bar" style={style} />
        {item ?
          <div>
            <h1 className="post-title">{item.title}</h1>
            {!item.page ?
              <div className="post-meta">
                <div className="header-avatar">
                  {item.author.profile_image
                    ? <img className="avatar" alt="" src={item.author.profile_image} />
                    : <Icon glyph={Avatar} className="icon avatar" />}
                </div>
                <span className="header-meta">Article by <Customlink to={`authors/${item.author.slug}`}>{item.author.name}</Customlink> on {Moment(item.published_at).format('MMM D, YYYY')}</span>
                {(this.props.isAdmin || (this.props.user && this.props.user.id === item.author.id)) ?
                  <Customlink to={`/admin/${item.id}`} className="btn btn-primary align-right"><Icon glyph={Edit} />Edit post</Customlink>
                : null}
              </div>
            : null}
            {item.page && this.props.isAdmin ?
              <div className="post-meta">
                <Customlink to={`/admin/${item.id}`} className="btn btn-primary align-right"><Icon glyph={Edit} />Edit page</Customlink>
              </div>
            : null}
            {item.feature_image ?
              <img className="featured-image" src={item.feature_image} width="200" alt={item.title} />
            : null}
            <div className="excerpt fr-view" dangerouslySetInnerHTML={{ __html: item.html }} />
            {(!item.page && (this.props.isAdmin || (this.props.user && this.props.user.id === item.author.id))) ?
              <div className="post-meta-footer">
                {item.author.profile_image
                  ? <img className="avatar" alt="" src={item.author.profile_image} />
                  : <Icon glyph={Avatar} className="icon avatar" />}
                <span className="author">
                  Article by <Customlink to={`authors/${item.author.slug}`}>{item.author.name}</Customlink>
                </span>
                <div className="date">
                  Published on {Moment(item.published_at).format('MMM D, YYYY')}
                </div>
              </div>
            : null}
            <Helmet>
              <title>{`${item.title} | ${CONSTANTS.APP_NAME}`}</title>
              <meta property="og:type" content="article" />
              <meta property="og:title" content={item.title} />
              <meta property="og:description" content={item.html ? item.html.substring(0, 200).replace(/<(?:.|\n)*?>/gm, '') : ''} />
              <meta property="og:url" content={window.location.href} />
              <meta property="og:image" content={item.feature_image} />
              <meta property="article:published_time" content={item.published_at} />
              <meta property="article:modified_time" content={item.updated_at} />
            </Helmet>
          </div>
        : 'This article is not published or does not exist'}
      </section>
    );
  }
}

export default Post;
