var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passport = require('passport')
LocalStrategy = require('passport-local').Strategy;
var sqldb = require("../models")
var encrpyt_decrypt = require("./encryption")

var authentication = require("./authentication");
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//User Registration
// ***********************************
// localhost:8080/Registration
// {
//   "email":"jaay@yopmail.com",
//   "password":"jay123",
//   "name":"Jay bhavsar",
//   "gender":"M"
// }
// ***********************************
router.post('/Registration', async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.json({ "status": 0, "message": "Please enter email address" });
    } else if (!req.body.password) {
      res.json({ "status": 0, "message": "Please enter password" });
    } else {
      let exist_user = await sqldb.users.findOne({
        where: { email: req.body.email },
        attributes: ["user_id", "email", "password"]
      });
      if (exist_user) {
        throw new Error("User already exist.");
      } else {
        let insert_user = await sqldb.users.create({
          email: req.body.email,
          name: req.body.name,
          gender: req.body.gender,
          password: encrpyt_decrypt.encrypt(req.body.password)
        });

        res.json({ "status": 1, "message": "User has been register successfully." });
      }
    }
  } catch (e) {
    res.json({ "status": 0, "message": e.message });
  }
});

// User Login
// ***********************************
// localhost:8080/Login
// {
//   "email":"jay@yopmail.com",
//   "password":"jay123"
// }
// ***********************************
router.post('/Login', async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.json({ "status": 0, "message": global_string.email_not_found });
    } else if (!req.body.password) {
      res.json({ "status": 0, "message": global_string.password_not_found });
    } else {
      var user_data = await sqldb.users.findOne({ where: { email: req.body.email } });
      if (user_data) {
        if (encrpyt_decrypt.decrypt(user_data.password) == req.body.password) {
          var token = jwt.sign({ user_id: user_data.user_id, identify: "login user" }, process.env.privatekey);
          var update_user = await sqldb.users.update({ is_logout: 0 }, { where: { email: req.body.email } });
          res.json({ 'res': '1', 'msg': "Successfully login", token: token })
        } else {
          res.json({ 'res': '0', 'msg': "Invalid password." })
        }
      } else {
        res.json({ 'res': '0', 'msg': "Email id not registerd" })
      }
    }
  } catch (e) {
    res.json({ "status": 0, "message": e.message });
  }

});

//Update user profile
// ***********************************
// localhost:8080/UpdateUserProfile/:user_id
// {
//   "email":"jay@yopmail.com",
//   "name":"Jay R. bhavsar",
//   "gender":"M",
//   "profile_url":"1.jpeg"
// }
// ***********************************
router.put('/UpdateUserProfile/:user_id', authentication, async (req, res, next) => {
  try {
    if (!req.body.email) {
      res.json({ "status": 0, "message": "Please enter email address" });
    } else if (!req.body.gender) {
      res.json({ "status": 0, "message": "Please enter gender" });
    } else if (!req.body.name) {
      res.json({ "status": 0, "message": "Please enter name" });
    } else if (!req.body.profile_url) {
      res.json({ "status": 0, "message": "Please upload profile" });
    } else {
      let update_user = await sqldb.users.update({
        email: req.body.email,
        name: req.body.name,
        gender: req.body.gender,
        profile_url: req.body.profile_url,
      }, {
        where: { user_id: req.params.user_id }
      });
      res.json({ "status": 1, "message": "User profile has been updated successfully." });

    }
  } catch (e) {
    res.json({ "status": 0, "message": e.message });
  }
});

// Get User profile
// ***********************************
// localhost:8080/ViewUserProfile/:user_id
// ***********************************
router.get('/ViewUserProfile/:user_id', authentication, async (req, res, next) => {
  try {
    if (!req.params.user_id) {
      res.json({ "status": 0, "message": "Please enter user id" });
    } else {
      let list_user = await sqldb.users.findOne({
        where: { user_id: req.params.user_id },
        attributes: ['user_id', 'email', 'name', 'gender', 'profile_url']
      });
      res.json({ "status": 1, "message": "Success", "data": list_user })
    }
  } catch (e) {
    res.json({ "status": 0, "message": e.message });
  }
});

// Change Password 
// ***********************************
// localhost:8080/ChangePassword
// {
//   "oldpassword":"jay1234",
//   "newpassword":"jay1234",
//   "email":"jay@yopmail.com"
// }
// ***********************************
router.put('/ChangePassword', authentication, async (req, res, next) => {
  try {
    if (!req.body.oldpassword) {
      res.json({ "status": 0, "message": "Please enter old password" });
    } else if (!req.body.newpassword) {
      res.json({ "status": 0, "message": "Please enter new pasword" });
    } else if (!req.body.email) {
      res.json({ "status": 0, "message": "Please enter email" });
    } else {
      var user_data = await sqldb.users.findOne({ where: { email: req.body.email } });
      if (user_data) {
        if (encrpyt_decrypt.decrypt(user_data.password) == req.body.oldpassword) {
          let update_user = await sqldb.users.update({
            password: encrpyt_decrypt.encrypt(req.body.newpassword)
          }, {
            where: { email: req.body.email }
          });
          res.json({ 'res': '1', 'msg': "User password has been updated successfully" })
        } else {
          res.json({ 'res': '0', 'msg': "Invalid password." })
        }
      } else {
        res.json({ 'res': '0', 'msg': "user not registerd" })
      }
    }
  } catch (e) {
    res.json({ "status": 0, "message": e.message });
  }
});

// Logout users
router.post('/Logout', authentication, async (req, res, next) => {
  try {
    var updaate_user = jwt.sign({user_id: req.body.user_id, identify: "login user"}, "Stack", {});
    let update_user = await sqldb.users.update({
      is_logout: 1
    }, {
      where: { user_id: req.body.user_id }
    });
    res.json({ 'res': '1', 'msg': "user has been logout successfully." })

  } catch (e) {
    res.json({ "status": 0, "message": e.message });
  }
});

module.exports = router;
