import React from 'react';
import Icon from '../lib/icon/icon';
import Waves from '../../../assets/svg/waves.svg';

function Loader(props) {
  return (
    <section className={`loader ${props.isLoading ? 'fade-in' : 'fade-out'}`}>
      <div className="loader-circle" />
      <div className="loader-line-mask">
        <div className="loader-line" />
      </div>
      <div className="loader-images">
        <Icon glyph={Waves} className="loader-logo logo1" />
        <Icon glyph={Waves} className="loader-logo logo2" />
      </div>
    </section>
  );
}

export default Loader;
