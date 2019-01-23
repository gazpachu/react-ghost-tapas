import React, { Component } from 'react';
import { connect } from 'react-redux';
import Navigation from '../navigation/navigation';
import { setAlphaSorting, setLoginOpened } from '../../../actions/actions';
import * as CONSTANTS from '../../../constants/constants';
import ApiHelpers from '../../common/apiHelpers';
import LinkCustom from '../lib/link/link';
import SearchBox from '../searchBox/searchBox';
import Icon from '../lib/icon/icon';
import Avatar from '../../../assets/svg/avatar.svg';
import Logout from '../../../assets/svg/icon-logout.svg';
import Logo from '../../../assets/svg/logo.svg';
import Wave from '../../../assets/svg/wave.svg';

class TopNav extends Component {

  constructor(props) {
    super(props);

    this.state = {
      musicPlaying: false
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscKey.bind(this), false);
    this.audio = null;
  }

  toggleNav() {
    const sideNav = document.getElementById('sidenav');
    if (!sideNav.classList.contains('opened')) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  openNav() {
    const sideNav = document.getElementById('sidenav');
    const navIcon = document.getElementById('nav-icon');

    if (!sideNav.classList.contains('opened')) {
      sideNav.classList.remove('opened');
      sideNav.classList.add('opened');
      sideNav.classList.remove('closed');
      navIcon.classList.add('opened');
    }

    if (!this.props.isDesktop) {
      const logo = document.getElementById('logo');
      logo.style.display = 'none';
    }
  }

  closeNav() {
    const sideNav = document.getElementById('sidenav');
    const navIcon = document.getElementById('nav-icon');

    if (sideNav.classList.contains('opened')) {
      sideNav.classList.remove('opened');
      sideNav.classList.add('closed');
      navIcon.classList.remove('opened');
    }

    if (!this.props.isDesktop) {
      const logo = document.getElementById('logo');
      logo.style.display = 'block';
    }
  }

  handleEscKey(evt) {
    let isEscape = false;

    if ('key' in evt) {
      isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
    } else {
      isEscape = (evt.keyCode === 27);
    }

    if (isEscape) {
      this.closeNav();
    }
  }

  toggleAudio(state) {
    this.setState({ musicPlaying: state });

    if (!this.audio) {
      this.audio = new Audio(`${CONSTANTS.ASSETS_PATH}mp3/audio.mp3`);
      this.audio.loop = true;
    }
    if (state) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  render() {
    return (
      <section id="top-nav" className="top-nav">
        <div className="top-nav-bar">
          <button
            id="nav-icon"
            className="top-nav-item nav-icon"
            onClick={() => { this.toggleNav(); }}
            aria-label="toggle nav"
            aria-labelledby="top-nav"
          >
            <span />
            <span />
            <span />
            <span />
          </button>

          <SearchBox />

          <LinkCustom to="/" title="Go to the Home page" className="logo-wrapper">
            <Icon glyph={Logo} className="icon logo" />
            <div className="masked-logo">
              <Icon glyph={Wave} className="icon wave" />
            </div>
            <svg width="0" height="0">
              <defs>
                <clipPath id="logo-mask">
                  <path fill="#FF0000" d="M120.692,38.808H0V0.192h140c0,0-28.205,2.158-28.016,12.947c0.189,10.79,21.012,5.414,20.633,13.554C132.239,34.832,120.692,38.808,120.692,38.808z" />
                </clipPath>
              </defs>
            </svg>
          </LinkCustom>

          <div className="user-info">
            {this.props.user
              ? <LinkCustom to="/admin" className="username" aria-label="username" aria-labelledby="top-nav">
                <span>{this.props.user.name}</span>
                <img className="avatar" alt="" src={this.props.user.profile_image} />
              </LinkCustom>
              : <button className="username" onClick={() => this.props.setLoginOpened(!this.props.loginOpened)}>Sign In <Icon glyph={Avatar} className="icon avatar" /></button>}
            <ul id="exit-items" className="exit-nav">
              <li className="exit-item">
                <button onClick={() => ApiHelpers.logout()}>
                  <Icon glyph={Logout} />
                </button>
              </li>
            </ul>
          </div>
        </div>
        <Navigation toggleNav={() => this.toggleNav()} />
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    user,
    isDesktop,
    loginOpened
  }
}) => ({
  user, isDesktop, loginOpened
});

const mapDispatchToProps = {
  setAlphaSorting,
  setLoginOpened
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
