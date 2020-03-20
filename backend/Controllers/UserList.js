
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var config = require('../config.json');
var bcrypt = require('bcryptjs');
const ObjectId = mongoose.Types.ObjectId;
var mongoose = require('mongoose'),
    User = mongoose.model('Users');



exports.list_all_users = function (req, res) {
    debugger;
    User.find({}, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};


exports.getAdmin = function (req, res) {
    debugger;
    User.find({ "role": "admin" }, function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.create_a_user = async function (req, res) {
    debugger;
    var new_user = new User(req.body);
    let password = req.body.password;
    console.log(req.body.password)
    //new_user['password'] = bcrypt.hashSync(password, 10)

    let usersWithEmail = await User.find({ email: new_user['email'] });
    console.log("lenghth" + usersWithEmail.length)
    if (usersWithEmail.length > 0) {
        res.status(500);
        return res.json({ message: 'Email already exists.' });
    }

    new_user.save(function (err, user) {

        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.read_a_user = function (req, res) {
    debugger;
    console.log("userId" + req.params.userId)
    // console.log("user id"+  ObjectId(req.params.userId))
    // User.findById({user_id: ObjectId(req.params.userId) },
    User.findById((req.params.userId), function (err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};

exports.authentication = function (req, res) {
    debugger;
    let email = req.body.email;
    let password = req.body.password;
    console.log("email and password is " + email + '' + bcrypt.hashSync(password) + ' ' + password);
    if (email && password) {
        User.aggregate([
            {
                $match: {
                    $and: [
                        { email: email.toLowerCase() },
                        { password: password.toLowerCase() }
                    ]
                }
            }
        ], async function (err, user) {
            if (err) {
                res.status(500);
                res.json(err);
            } else if (user[0] && (password, user[0].password)) {
                console.log(user)
                console.log("inside the authentiation controlller")
                user = user[0];
                console.log("user of 0" + user[0])
                if (email != null && password != null) {
                    delete user.password;
                    const token = jwt.sign({ sub: user._id }, config.secret);
                    user['token'] = token;
                    res.send(user);
                }
                else {
                    res.status(500);
                    res.json({ message: 'You are not allowed to login.' });
                }
            } else {
                res.status(400);
                res.json({ message: 'Wrong Email or password' });
            }
        });
    } else {
        res.status(500);
        res.json('Email & password are required');
    }
}

exports.update = function (req, res) {
    debugger;
    console.log("userId in update method" + req.params.userId)
    // User.findById({user_id: ObjectId(req.params.userId) },
    User.findById(req.params.userId, function (err, user) {
        if (err) {
            res.status(500);
            return res.send(err);
        } else if (user) {
            console.log("user data" + JSON.stringify(user))
            let email = req.body.email ? req.body.email : user.email;
            console.log('here is the elseif', user);
            user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
            user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
            user.email = email;
            user.password = req.body.password ? req.body.password : user.password;

            user.save(function (err) {
                if (err) {
                    res.status(500)
                    res.json(err);
                } else {
                    res.json({
                        message: 'User Info updated',
                        data: user
                    });
                }
            });
        }
    });
};

exports.deleteUser = function (req, res) {
    console.log("inside delete")
    console.log("user id" + ObjectId(req.params.userId))
    console.log("user id" + (req.params.userId))
    User.deleteOne({ _id: ObjectId(req.params.userId) }, function (err, obj) {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.json({
                message: 'user deleted'
            })
        }
    });
};
