const express = require("express");
const router = express.Router();
const user = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userconfig = require("../config/user.config");
const nodemailer = require("../config/nodemailer.config");

router.post("/user/add", function (req, res) {
  const token = jwt.sign({ email: req.body.email }, userconfig.secret);
  var userData = new user({
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Password: req.body.Password,
    ConfirmationCode: token,
  });
  //for encrypting the password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(userData.Password, salt, (err, hash) => {
      if (err) throw err;
      userData.Password = hash;
      userData.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({
          message: "User was registered successfully! Please check your email",
        });

        nodemailer.sendConfirmationEmail(
          userData.FirstName,
          userData.Email,
          userData.ConfirmationCode
        );
      });
    });
  });
});

router.post("/user/login", (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;

  user.findOne({ Email: Email }).then(function (userData) {
    if (userData === null) {
      //killing the code not giving further access
      return res
        .status(403)
        .json({ success: false, message: "Invalid Credentials" });
    }
    bcrypt.compare(Password, userData.Password, function (err, result) {
      if (result === false) {
        return res
          .status(201)
          .json({ success: false, message: "Invalid Credentials" });
      }
      //generating token
      const token = jwt.sign({ userId: userData._id }, "secretkey");
      res.status(200).json({
        success: true,
        message: "Logged In Successfully",
        token: token,
      });
    });
  });
});

router.put("/user/confirm/:confirmationcode", (req, res) => {
  user
    .findOne({
      ConfirmationCode: req.params.confirmationcode,
    })
    .then(function (data) {
      if (data.Status === "Verified") {
        return res.status(200).send({ message: "Already Verified" });
      } else if (!data) {
        return res.status(404).send({ message: "User Not Found" });
      } else if (data) {
        user
          .updateOne(
            { ConfirmationCode: req.params.confirmationcode },
            { Status: "Verified" }
          )
          .then(function () {
            const message = "Account Verified";
            res.status(201).json({ success: true, message: message });
            console.log(message);
          })
          .catch(function (err) {
            res.status(500).json({ success: false, message: err });
          });
      }
    })
    .catch(function (e) {
      res.status(500).json({ success: false, message: e });
    });
});

module.exports = router;
