
//let router = require('express').Router();

module.exports = function (app) {
    var userList = require('../controllers/UserList');

    //missed parentesis
    app.route('/users')
        .post(userList.create_a_user);

    app.route('/users')
        .get(userList.list_all_users)

    app.route('/users/admin')
        .get(userList.getAdmin)

    app.route('/users/:userId')
        .get(userList.read_a_user)
        .put(userList.update)

    app.route('/delete/:userId')
        .delete(userList.deleteUser)

    app.route('/authentication')
        .post(userList.authentication)


};