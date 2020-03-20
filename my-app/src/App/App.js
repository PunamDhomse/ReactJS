import React from 'react';
import { Login } from '../Login';
import { Dashboard } from '../Dashboard';
import { Register } from '../Register';
import { Edit } from '../Edit';
import { Admin } from '../NewAdmin';
import { Router, Route, Switch, Redirect } from 'react-router';
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/edit/:id" component={Edit} />
            <Route path="/register" component={Register} />
            {localStorage.getItem('user') == null ? <Route path="/" component={Login} /> :
              <Route path="/dashboard" component={Dashboard} />}
            <Route path="/newAdmin" component={Admin} />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
