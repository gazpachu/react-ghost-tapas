import React from 'react';
import { Link } from 'react-router';
import { history } from '../../../../store';
import { APP_PATH } from '../../../../constants/constants';

export default function LinkCustom({ to, className, id, title, children, onClick }) {
  return (
    <Link
      to={to}
      id={id}
      className={className}
      title={title}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        if (window.swUpdate) {
          const path = `/${APP_PATH}{to}`;
          window.location = path;
        }
        if (onClick) {
          onClick();
        }
        history.push(to);
      }}
    >
      {children}
    </Link>
  );
}
