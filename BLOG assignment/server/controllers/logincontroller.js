const express = require("express");
const Login = require("../model/loginmodel");
const router = express();
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
// const Token = require('../model/loginmodel')

exports.adminIdPass = (req, res) => {
  Login.find().exec(async (err, admin) => {
    if (
      admin[0].email === req.query.email &&
      admin[0].password === req.query.password
    ) {
      const token = jwt.sign(
        {
          email: admin[0].email,
          password: admin[0].password,
        },
        "secret"
      );

      const data = await Login.updateOne(
        { _id: admin[0]._id },
        { $set: { token: token } }
      );

      console.log(token);
      res.redirect("/admin");
    }
    
    else {
      res.render("Login");
    }
  }
)}

exports.logout = async (req, res) => {
  const admin = await Login.find().exec();
  const data = await Login.findByIdAndUpdate({_id: admin[0]._id},
  {$set: { token: null}
})
  res.redirect('Login');
}