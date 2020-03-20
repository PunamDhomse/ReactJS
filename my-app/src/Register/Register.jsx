import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../custom.css';
import Button from 'react-bootstrap/Button';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import Form from 'react-bootstrap/Form';
export class Register extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.state = {
      user: {
        firstname: '',
        lastname: '',
        email: '',
        password: ''
      },
      submitted: false,
      invalid: false,
      mail: true,
      fname: true,
      lname: true,
      users: [],
      error: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }


  ValidateEmail = (mail) => {
    if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return (true)
    }
    return (false)
  }

  ValidateName = (fname) => {
    if (/^[a-zA-Z]+$/.test(fname)) {
      return (true)
    }
    return (false)
  }

  ValidateName = (lname) => {
    if (/^[a-zA-Z]+$/.test(lname)) {
      return (true)
    }
    return (false)
  }

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    if (name === 'email') {
      this.ValidateEmail(value) ? this.setState({ mail: true }) : this.setState({ mail: false });
    }
    if (name === 'firstname') {
      this.ValidateName(value) ? this.setState({ fname: true }) : this.setState({ fname: false });
    }
    if (name === 'lastname') {
      this.ValidateName(value) ? this.setState({ lname: true }) : this.setState({ lname: false });
    }
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  handleResponse(response) {
    debugger;
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      console.log(response)
      if (!response.ok) {
        if (response.status === 401) {
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
    debugger;
    event.preventDefault();
    this.setState({ submitted: true });
    const { user } = this.state;
    if (user.firstname.trim() !== '' && user.lastname.trim() !== '' && user.email.trim() !== '' && user.password != null) {
      this.Register(user)
        .then(
          user => {
            this.props.history.push('/login');
          },
          error => {
            console.log("error in side register method" + error)
            this.setState({ error: error })
          }
        )
    }
    else {
      this.setState({ invalid: true });
    }
  }


  Register(user) {
    debugger;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    };

    console.log("Inside login");
    console.log("email and password " + user)
    return fetch(`http://localhost:5000/users`, requestOptions)
      .then(this.handleResponse)
  }


  render() {
    const { user } = this.state
    return (
      <div>
        <NavigationBar {...this.props} />
        <div className="container">
          <div className=" mt-3 ">
            <div className="card-body">
              <div className="row mt-2">
                <div className="col-md-7">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h3 className="panel-title mb-3">Register User</h3>
                      {this.state.error ? <div className="text-danger">Email already exits</div> : ''}
                    </div>
                    <div className="panel-body">
                      <form name="form" onSubmit={this.handleSubmit}>
                        <div>
                          <Form.Group >
                            <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="firstname" maxLength="30" placeholder="First Name" value={user.firstname} onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                            </Form.Text>
                            {!this.state.fname ? <span className="text-danger">Please enter valid name</span> : null}
                          </Form.Group>
                        </div>
                        <div >
                          <Form.Group >
                            <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="lastname" placeholder="Last Name" maxLength="30" value={user.lastname} onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                            </Form.Text>
                            {!this.state.lname ? <span className="text-danger">Please enter valid name</span> : null}
                          </Form.Group>
                        </div>
                        <div >
                          <Form.Group >
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="email" name="email" placeholder="Email" maxLength="50" value={user.email} onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                            </Form.Text>
                            {!this.state.mail ? <span className="text-danger">Please enter valid email</span> : null}
                          </Form.Group>
                        </div>
                        <div>
                          <Form.Group >
                            <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="password" name="password" placeholder="Password" maxLength="16" value={user.password} onChange={this.handleChange} required />
                            <Form.Text className="text-muted">
                            </Form.Text>
                          </Form.Group>
                        </div>
                        <Button type="submit" variant='primary'>Register</Button>
                      </form>
                    </div>
                  </div>
                  <div className="row mt-3">
                    {this.state.invalid ?
                      <div className="col-12 P-0"><div className={`alert alert-danger`}>Please fill all fields</div></div> : null
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}