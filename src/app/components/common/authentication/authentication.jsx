import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLoginOpened } from '../../../actions/actions';
import ApiHelpers from '../apiHelpers';

class Authentication extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  signIn(event) {
    event.preventDefault();
    ApiHelpers.login(this.state.username, this.state.password);
    this.setState({
      username: '',
      password: ''
    });
    this.props.setLoginOpened(false);
  }

  render() {
    return (
      <form className={`authentication ${this.props.loginOpened ? 'opened' : ''}`} onSubmit={event => this.signIn(event)}>
        <p>
          <input type="text" name="username" value={this.state.username} onChange={event => this.handleChange(event)} placeholder="Email..." />
        </p>
        <p>
          <input type="password" name="password" value={this.state.password} onChange={event => this.handleChange(event)} placeholder="Password..." />
        </p>
        <p>
          <input type="submit" className="btn btn-primary" value="Sign In" />
        </p>
      </form>
    );
  }
}

const mapDispatchToProps = {
  setLoginOpened
};

const mapStateToProps = ({
  mainReducer: {
    loginOpened
  }
}) => ({
  loginOpened
});

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
