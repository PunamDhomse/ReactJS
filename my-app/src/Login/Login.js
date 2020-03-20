import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../custom.css';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import Button from 'react-bootstrap/Button';

// import { Link } from 'react-router-dom';
export class Login extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.state = {
      email: '',
      password: '',
      submitted: false,
      users: [],
      error: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      console.log(response)
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          this.logout();
          window.location.href = '/';
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      console.log('this is ', data);
      return data;
    });
  }


  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitted: true });
    const { email, password } = this.state;
    if (email && password) {
      this.Login(email, password);
    }
  }


  Login(email, password) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    };

    console.log("Inside login");
    console.log("email and password " + email + '' + password)
    return fetch(`http://localhost:5000/authentication `, requestOptions)
      .then(this.handleResponse)
      .then(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.props.history.push('/dashboard');
        window.location.reload(false);
        return user;
      }).catch(error => {
        console.log(error)
        this.setState({ error: error });
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  render() {
    const { email, password, submitted } = this.state;
    return (
      <div>
        <NavigationBar {...this.props} />
        <div className="container loginForm">
          <div className="row">
            <div className="col-md-6 ">
              {this.state.error ? <div className="text-danger">Wrong Email and Password</div> : ''}
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h3 className="panel-title">Please sign in</h3>
                </div>
                <div className="panel-body">
                  <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                      <input className="form-control" placeholder="Email" value={email} onChange={this.handleChange} name="email" type="text" />
                      {submitted && !email &&
                        <div className="help-block text-danger">Email is required</div>
                      }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                      <input className="form-control" placeholder="Password" value={password} onChange={this.handleChange} name="password" type="password" />
                      {submitted && !password &&
                        <div className="help-block text-danger">Password is required</div>
                      }
                    </div>
                    <Button type="submit" className="col-md-2" variant='primary'>LOGIN</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}