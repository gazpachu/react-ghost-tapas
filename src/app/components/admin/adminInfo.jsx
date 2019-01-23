import React from 'react';
import Customlink from '../common/lib/link/link';

export default function AdminInfo({ start }) {
  return (
    <section className="admin-info">
      <h1>Hey, fellow writer!</h1>
      <p>Is this your first article?</p>
      <p>If that&apos;s the case, we highly recommend you to read the <strong><Customlink to="/faqs">Start Guide (FAQs)</Customlink></strong> and learn about:</p>
      <ul className="admin-info-list">
        <li>Where to find <strong>high quality photos</strong> with creative commons licenses</li>
        <li>What are the <strong>allowed dimensions and formats</strong> for your pictures</li>
        <li>How to correctly cite your sources and licensed material</li>
        <li>How to embed videos, create links or edit tables</li>
        <li>And much more!</li>
      </ul>
      <p>
        <button className="btn btn-primary btn-ready" onClick={start}>I&apos;m ready!</button>
      </p>
    </section>
  );
}
