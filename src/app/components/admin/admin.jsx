import React, { Component } from 'react';
import AdminListingContainer from '../admin/adminListingContainer';
import Customlink from '../common/lib/link/link';

class Admin extends Component {

  componentDidMount() {
    this.props.setLoading(false);
  }

  handleChange(field, event) {
    this.setState({ [field]: event.target.value });
  }

  render() {
    return (
      <section className="page">
        <div className="section hero">
          <h1 className="align-left">Latest posts and pages</h1>
          <Customlink to="/admin/new" className="btn btn-primary align-right">Write a post</Customlink>
        </div>
        <div className="listing">
          <AdminListingContainer />
        </div>
      </section>
    );
  }
}

export default Admin;
