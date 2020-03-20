import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../custom.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export class NavigationBar extends React.Component {

  render() {
    let user = JSON.parse(localStorage.getItem('user'));
    return (
      <div>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          {localStorage.getItem('user') == null ? <Navbar.Brand href="/">Log In</Navbar.Brand> : <Navbar.Brand>React</Navbar.Brand>}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {localStorage.getItem('user') == null ? <Link className="text-white" to="/register" >Register</Link> : ' '}
              {localStorage.getItem('user') != null ? <Link className="text-white" to="/dashboard" >Dashboard </Link> : ' '}
              {localStorage.getItem('user') != null && user.role === 'admin' ? <Link className="text-white ml-2" to="/newAdmin" >Add Admin </Link> : ' '}
            </Nav>
            <Nav>
              {localStorage.getItem('user') != null ? <Link onClick={() => localStorage.removeItem('user')} className="text-white" to="/">LogOut  </Link> : ' '}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}