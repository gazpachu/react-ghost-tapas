import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import Toggle from 'react-toggle';
import 'froala-editor/js/froala_editor.pkgd.min';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins/code_view.min';
import 'froala-editor/js/plugins/word_paste.min';
import 'froala-editor/js/plugins/image.min';
import 'froala-editor/js/third_party/image_aviary.min';
import 'froala-editor/js/third_party/spell_checker.min';
import {
  setNotification,
  resetResource,
  setAuthor
} from '../../actions/actions';
import AdminInfo from './adminInfo';
import ApiHelpers from '../common/apiHelpers';
import Helpers from '../common/helpers';
import * as CONSTANTS from '../../constants/constants';
import { history } from '../../store';
import Customlink from '../common/lib/link/link';
import Icon from '../common/lib/icon/icon';
import Link from '../../assets/svg/link.svg';
import Refresh from '../../assets/svg/refresh.svg';
import Garbage from '../../assets/svg/garbage.svg';
import User from '../../assets/svg/user.svg';
import Cog from '../../assets/svg/cog.svg';
import Help from '../../assets/svg/question.svg';
import Calendar from '../../assets/svg/calendar.svg';

class AdminPost extends Component {

  constructor(props) {
    super(props);

    this.state = {
      started: false,
      id: '',
      title: 'Untitled',
      slug: 'untitled',
      page: false,
      autosave: true,
      editor: '',
      featuredImage: '',
      published_at: Moment(),
      featuredImageLoading: false,
      deletePost: false,
      config: null
    };

    this.saveInterval = null;
    this.onTitleChanged = this.onTitleChanged.bind(this);
    this.onDateChanged = this.onDateChanged.bind(this);
    this.onEditorChanged = this.onEditorChanged.bind(this);
    this.refreshSlug = this.refreshSlug.bind(this);
    this.removeFeaturedImage = this.removeFeaturedImage.bind(this);
  }

  componentDidMount() {
    this.props.resetResource('posts');
    this.saveInterval = setInterval(() => {
      if (this.state.started && this.state.autosave) {
        this.updatePost('draft');
      }
    }, 30000);
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.id) {
      if (newProps.posts && newProps.posts[0]) {
        this.setState({
          id: newProps.posts[0].id,
          title: newProps.posts[0].title,
          slug: newProps.posts[0].slug,
          page: newProps.posts[0].page,
          autosave: !(newProps.posts[0].status === 'published') && !newProps.posts[0].page,
          editor: newProps.posts[0].html,
          featuredImage: newProps.posts[0].feature_image,
          started: true,
          published_at: Moment(newProps.posts[0].published_at)
        });
      } else {
        this.reset();
      }
    }

    if (this.props.apiReady && !this.state.config && (this.state.started || (newProps.posts && newProps.posts[0]))) {
      this.setState({
        config: {
          scaytAutoload: true,
          scaytOptions: {
            DefaultSelection: 'British English',
            spellcheckLang: 'en_GB'
          },
          scaytCustomerId: '1:4SfwL-4cZ6v4-uujDT1-p4enS1-48IXT2-60viW-uRd3R1-sfP2W3-AcUkh2-Zg7ZF3-oNWJl2-ZT9',
          toolbarButtons: ['fullscreen', 'bold', 'italic', 'strikeThrough', 'paragraphFormat', 'align', '|', 'fontSize', 'color', 'subscript', 'superscript', 'formatOL', 'formatUL', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'specialCharacters', 'html'],
          toolbarButtonsSM: ['fullscreen', 'bold', 'italic', 'strikeThrough', 'paragraphFormat', 'align', '|', 'fontSize', 'color', 'subscript', 'superscript', 'formatOL', 'formatUL', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'specialCharacters', 'html'],
          toolbarButtonsXS: ['fullscreen', 'bold', 'italic', 'strikeThrough', 'paragraphFormat', 'align', '|', 'fontSize', 'color', 'subscript', 'superscript', 'formatOL', 'formatUL', 'insertLink', 'insertImage', 'insertVideo', 'insertTable', 'specialCharacters', 'html'],
          requestHeaders: {
            Authorization: ApiHelpers.getToken()
          },
          imageInsertButtons: ['imageBack', '|', 'imageUpload', 'imageByURL'],
          videoInsertButtons: ['videoBack', '|', 'videoByURL', 'videoEmbed'],
          quickInsertTags: [],
          imageDefaultWidth: 100,
          imageResizeWithPercent: true,
          imageRoundPercent: true,
          imageUploadParam: 'uploadimage',
          imageUploadURL: `${CONSTANTS.API_URL}${CONSTANTS.API_PATH}/ghost/api/v0.1/uploads`,
          fileUploadURL: `${CONSTANTS.API_URL}${CONSTANTS.API_PATH}/ghost/api/v0.1/uploads`,
          events: {
            // 'froalaEditor.file.beforeUpload': (e, editor, files) => {
            //   console.log(files);
            // },
            // 'froalaEditor.image.uploaded': (e, editor, response) => {
            //   console.log(response);
            // },
            'froalaEditor.image.error': (e, editor, error) => {
              this.props.setNotification({ message: String(error.message), type: 'error' });
            }
          }
        }
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.saveInterval);
  }

  onTitleChanged(event) {
    this.setState({ title: event.target.value });
  }

  onDateChanged(date) {
    this.setState({ published_at: date });
  }

  onEditorChanged(editor) {
    this.setState({ editor });
  }

  reset() {
    this.setState({
      id: '',
      title: 'Untitled',
      slug: 'untitled',
      page: false,
      autosave: true,
      editor: '',
      featuredImage: '',
      published_at: Moment()
    });
  }

  updatePost(status) {
    const promise = ApiHelpers.updatePost(
      this.state.id,
      (this.props.posts && this.props.posts[0].author.id) ? this.props.posts[0].author.id : this.props.user.id,
      this.state.title,
      this.state.editor,
      this.state.featuredImage,
      this.state.page,
      status,
      this.state.published_at
    );

    promise.then((response) => {
      if (this.props.location.pathname === '/admin/new') {
        this.setState({ id: response.data.posts[0].id }, () => {
          history.push(`/admin/${response.data.posts[0].id}`);
        });
      } else if (status === 'draft') {
        this.statusRef.classList.remove('published');
        this.statusRef.classList.add('draft');
        this.statusRef.innerHTML = 'draft';
      } else {
        this.statusRef.classList.remove('draft');
        this.statusRef.classList.add('published');
        this.statusRef.innerHTML = 'published';
        this.setState({ autosave: false });
      }
    });
  }

  featuredImageChanged(file) {
    this.setState({ featuredImageLoading: true });
    ApiHelpers.uploadFile(file).then((response) => {
      this.setState({
        featuredImageLoading: false,
        featuredImage: response.data.link
      });
    });
  }

  removeFeaturedImage() {
    this.setState({ featuredImage: '' });
  }

  refreshSlug() {
    if (this.state.title.length > 0) {
      this.setState({ slug: Helpers.slugify(this.state.title) });
    }
  }

  start() {
    this.setState({ started: true }, () => {
      this.updatePost('draft');
    });
  }

  render() {
    return (
      <section className="page admin-post">
        {this.props.posts && (!this.props.isAdmin && (this.props.user && this.props.user.id !== this.props.posts[0].author.id)) ?
          <div className="help-banner" id="help-banner">
            Sorry, you don&apos;t have permission to edit this post
          </div>
        : <div className="post-edit-wrapper">
          {this.state.started ?
            <div className="post-header">
              <div className="post-meta">
                <input
                  type="text"
                  className="title"
                  placeholder="Post title"
                  value={this.state.title}
                  name="title"
                  onChange={this.onTitleChanged}
                  // onBlur={() => this.updatePost('draft')}
                />
                <div className="meta-line">
                  <Icon glyph={Link} />
                  {this.props.posts && this.props.posts[0] ?
                    <Customlink to={`/${this.state.slug}`}>{this.state.slug}</Customlink>
                  : null}
                  {this.state.title.length > 0 ?
                    <button className="btn btn-primary btn-refresh xs" onClick={this.refreshSlug}>update <Icon glyph={Refresh} /></button>
                  : null}
                </div>
                {this.props.posts && this.props.posts[0] ?
                  <div className="meta-groups">
                    <div className="meta-group">
                      <div className="meta-line"><Icon glyph={User} />Created by <Customlink to={`authors/${this.props.posts[0].author.slug}`}>{this.props.posts[0].author.name}</Customlink></div>
                      <div className="meta-line"><Icon glyph={Calendar} />Created on {Moment(this.props.posts[0].created_at).format('MMM D, YYYY')}</div>
                    </div>
                    <div className="meta-group">
                      <div className="meta-line">
                        <Icon glyph={Cog} />
                        {this.props.isAdmin ?
                          <span>
                            <label htmlFor="type">Page</label>
                            <Toggle
                              id="type"
                              className="toggle"
                              checked={this.state.page}
                              onChange={() => this.setState({ page: !this.state.page })}
                            />
                          </span>
                        : null}
                        <label htmlFor="autosave">Autosave</label>
                        <Toggle
                          id="autosave"
                          className="toggle"
                          checked={this.state.autosave}
                          onChange={() => this.setState({ autosave: !this.state.autosave })}
                        />
                      </div>
                      <div className="meta-line">
                        <Icon glyph={Calendar} />{this.props.posts[0].published_at ? 'Published on ' : 'Not yet published'}
                        {this.props.posts[0].published_at ?
                          <div className="date-picker">
                            <DatePicker
                              selected={this.state.published_at}
                              onChange={this.onDateChanged}
                            />
                          </div>
                        : null}
                        <span ref={(status) => { this.statusRef = status; }} className={`status ${this.props.posts[0].status}`}>{this.props.posts[0].status}</span>
                      </div>
                    </div>
                  </div>
                : null}
              </div>
              <div
                className="featured-image photo-image"
                style={this.state.featuredImage || this.state.featuredImageLoading ?
                  { backgroundImage: `url(${this.state.featuredImage})`, backgroundSize: 'cover' }
                : null}
              >
                {this.state.featuredImage ?
                  <button className="btn-remove-featured-image" onClick={this.removeFeaturedImage}><Icon glyph={Garbage} /></button>
                : null}
                {!this.state.featuredImage ?
                  <span className="upload-message">Upload post image</span>
                : null}
                {this.state.featuredImageLoading ?
                  <div className="loader-small" />
                : null}
                <input className="file-input" type="file" onChange={event => this.featuredImageChanged(event.target.files[0])} />
              </div>
            </div>
          : <AdminInfo start={() => this.start()} />}

          {this.state.config ?
            <FroalaEditor
              tag="textarea"
              config={this.state.config}
              model={this.state.editor}
              onModelChange={this.onEditorChanged}
            />
          : null}

          {this.state.started && this.state.editor.length === 0 ?
            <div className="meta-line inspiration">
              <Icon glyph={Help} />Nothing comes out? Don&apos;t worry, <a target="_blank" rel="noopener noreferrer" href="https://www.google.es/search?q=how+to+write+great+blog+posts">check these links out</a>
            </div>
          : null}

          <div className="submit-wrapper">
            {!this.props.isFetching && this.state.started ?
              <div>
                {this.state.id ?
                  <div>
                    {this.state.deletePost ?
                      <div className="remove-buttons">
                        Are you sure?
                        <button className="btn btn-tertiary" onClick={() => ApiHelpers.deletePost(this.state.id)}>Yes</button>
                        <button className="btn btn-primary" onClick={() => this.setState({ deletePost: false })}>No</button>
                      </div>
                    : <button className="btn btn-tertiary btn-delete" onClick={() => this.setState({ deletePost: true })}>Delete</button>}
                  </div>
                : null}
                <button className="btn btn-primary btn-submit" onClick={() => this.updatePost('draft')}>Save as draft</button>
                {this.state.id && this.props.isAdmin ?
                  <button className="btn btn-primary btn-submit" onClick={() => this.updatePost('published')}>Publish</button>
                : null}
                {this.state.id && !this.props.isAdmin ?
                  <button className="btn btn-primary btn-submit" onClick={() => ApiHelpers.requestReview(this.state.id)}>Request review</button>
                : null}
              </div>
            : null}
            {this.props.isFetching ?
              <div className="loader-small" />
            : null}
          </div>
        </div>}
      </section>
    );
  }
}

const mapDispatchToProps = {
  setNotification,
  resetResource,
  setAuthor
};

const mapStateToProps = ({
  mainReducer: {
    posts,
    isFetching,
    user,
    isAdmin
  }
}) => ({
  posts,
  isFetching,
  user,
  isAdmin
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminPost);
