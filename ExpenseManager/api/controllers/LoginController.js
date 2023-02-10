/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

module.exports = {
  //view login page to user
  login: (req, res) => {
    res.view("pages/login");
  },

  //login authentication with email and bcrypted password
  loginauth: async (req, res) => {
    //take email and password from body and store in variable
    const email = req.body.email;
    const password = req.body.password;

    //find specific user from database with email and fetch id in variable
    const user = await User.findOne({ email: email });
    const id = user.id;

    //if user is not find in database then give suggesion to signup as new user
    if (!user) {
      req.addFlash("fail", "New on our site?? Please signup");
      res.redirect("/login");
    }

    //else user is find in database then generate token with user email & id
    else {
      await User.findOne({ email: email }).exec(async (err, login) => {
        if (login) {
          const token = jwt.sign({ email: email, id: id }, "secret");
          res.cookie("jwt", token, {});

          //store token in database that find with email
          await User.update({ email: email }).set({
            token: token,
          });
          //compare the stored bcrypt password in database and verify that
          //if password is true then access user page by user
          if (await bcrypt.compare(password, login.password)) {
            return res.redirect("/user");
          }
          //else give error for invalid password
          else {
            req.addFlash("failpass", "Invaild password");
            return res.redirect("/login");
          }
        }
        //new user is login without signup then suggest to signup as new user
        else {
          req.addFlash("fail", "New on our site?? Please signup");
          res.redirect("/login");
        }
      });
    }
  },

  //logout the current login user
  logout: async (req, res) => {
    //logut user with null token & clear cookie and redirect to login
    const user = await User.find();
    await User.update({ id: user.id }).set({ token: null });
    res.clearCookie("jwt");
    res.redirect("Login");
  },
};
