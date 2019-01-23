import React from 'react';

export default function Icon({ glyph, width, height, id, className = 'icon', style }) {
  return (
    <svg viewBox={glyph.viewBox} id={id} className={className} width={width} height={height} style={style}>
      <use xlinkHref={`#${glyph.id}`} />
    </svg>
  );
}
