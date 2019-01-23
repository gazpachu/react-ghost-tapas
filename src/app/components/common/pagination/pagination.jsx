import React from 'react';
import Customlink from '../lib/link/link';

function Pagination(props) {
  return (
    <section className="pagination">
      {props.pagination && props.pagination.prev ?
        <Customlink className="prev" to={`${props.location.pathname}?page=${props.pagination.prev}`}>
          &lt; Previous page
        </Customlink>
      : <span className="prev disabled">&lt; Previous page</span>}
      {props.pagination && props.pagination.next ?
        <Customlink className="next" to={`${props.location.pathname}?page=${props.pagination.next}`}>
          Next page &gt;
        </Customlink>
      : <span className="next disabled">Next page &gt;</span>}
    </section>
  );
}

export default Pagination;
