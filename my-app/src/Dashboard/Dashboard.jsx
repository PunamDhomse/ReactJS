import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import DataTable from 'react-data-table-component';
import Button from 'react-bootstrap/Button'


export class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.state = {
      users: [],
      main: [],
      admins: [],
      isDelete: false,
      userId: '',
      role: ''
    };
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentDidMount() {
    debugger;
    let user = JSON.parse(localStorage.getItem('user'));
    if (user.role === 'admin') {
      this.Getuser().then(users => {
        this.setState({ users: users, main: users })
        console.log("users data is" + JSON.stringify(this.state.users))
      })
    } else if (user.role === 'user') {
      this.GetAllAdmin().then(users => {
        this.setState({ users: users, main: users })
        console.log("admins data is" + JSON.stringify(this.state.users))
      })
    }
  }

  searchText = (text) => {
    debugger;
    let { searchText, debounce } = this.state;
    searchText = text;
    let users = this.state.main.filter(item => item.firstname && item.lastname && item.email && (item.firstname.toLowerCase() + ' ' + item.lastname.toLowerCase() + ' ' + item.email.toLowerCase()).includes(text.toLowerCase()));
    this.setState({ searchText, debounce, users });
  }

  deleteUser = () => {
    debugger;
    var userId = this.state.userId;
    console.log(userId)
    this.deleteSpecificUser(userId).then(() => {
      this.setState({ isDelete: false, editModal: false });
      window.location.reload();
    });
  }

  deleteSpecificUser(userId) {
    debugger;
    console.log("deleteid=" + userId);
    const requestOptions = {
      method: 'DELETE',
      body: userId
    };

    return fetch(`http://localhost:5000/delete/${userId}`, requestOptions)
      .then(this.handleResponse)
  }

  Getuser() {
    debugger;
    const requestOptions = {
      method: 'GET'
    };

    return fetch(`http://localhost:5000/users`, requestOptions)
      .then(this.handleResponse)
  }


  GetAllAdmin() {
    debugger;
    const requestOptions = {
      method: 'GET'
    };

    return fetch(`http://localhost:5000/users/admin`, requestOptions)
      .then(this.handleResponse)
  }

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      console.log(response)
      if (!response.ok) {
        if (response.status === 401) {
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

  render() {
    let user = JSON.parse(localStorage.getItem('user'));
    // console.log("user login is" + user.role)
    const columns = [
      {
        name: 'Firstname',
        width: 150,
        selector: 'firstname',
        sortable: true,
        grow: 1
      },
      {
        name: 'Lastname',
        width: 150,
        selector: 'lastname',
        sortable: true,
        grow: 1
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true,
        grow: 1
      },
      {
        name: 'Edit',
        selector: 'edit',
        sortable: true,
        grow: 1,
        cell: row => <Link to={{ pathname: `edit/${row.id}` }} className="blue-link">EDIT</Link>
      },
      {
        name: 'Delete',
        selector: 'delete',
        sortable: true,
        grow: 1,
        cell: row => <Link onClick={() => this.setState({ isDelete: true, userId: row.id })} className="blue-link">DELETE</Link>
      }
    ];

    let tableData = [];
    this.state.users.forEach((users, index) => {
      const data = {
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        id: users._id
      }
      tableData.push(data);
    });


    const columnsForUser = [
      {
        name: 'Firstname',
        width: 150,
        selector: 'firstname',
        sortable: true,
        grow: 1
      },
      {
        name: 'Lastname',
        width: 150,
        selector: 'lastname',
        sortable: true,
        grow: 1
      },
      {
        name: 'Email',
        selector: 'email',
        sortable: true,
        grow: 1
      }
    ];


    let AdminTable = [];
    this.state.users.forEach((admins, index) => {
      const adminsData = {
        firstname: admins.firstname,
        lastname: admins.lastname,
        email: admins.email
      }
      AdminTable.push(adminsData);
    })

    return (
      <div>
        <NavigationBar {...this.props} />
        <div className="container ">
          <div className="row mt-3">
            <div className="col-sm-7 col-12">
              {user.role === 'user' ? <h2>Admins</h2> : <h2>Users</h2>}
            </div>
            <div className="col-sm-5 col-6 col-6 d-flex justify-content-end align-items-center">
              <input type='text' placeholder="Search for a User" className={'form-control'} onChange={(e) => this.searchText(e.target.value)} />
            </div>
          </div>
          {user.role === 'admin' ?
            <DataTable className="table"
              title=""
              columns={columns}
              data={tableData}
              pagination
              striped
              responsive
              highlightOnHover
              paginationPerPage={25}
              paginationRowsPerPageOptions={[25, 50, 100]} />
            : <div>
              <DataTable className="table"
                title=""
                columns={columnsForUser}
                data={AdminTable}
                pagination
                striped
                responsive
                highlightOnHover
                paginationPerPage={25}
                paginationRowsPerPageOptions={[25, 50, 100]} />
            </div>
          }
        </div>
        <Modal show={this.state.isDelete}>
          <Modal.Body>
            <div className="text-center">
              Do you really want to remove this record?</div>
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn btn-success btn btn-primary" onClick={() => this.deleteUser()}>
              Yes
            </Button>
            <button className="btn  btn-outline-secondary ml-1" variant="secondary" onClick={() => this.setState({ isDelete: false })}>
              No</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
