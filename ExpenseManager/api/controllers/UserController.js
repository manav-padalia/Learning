/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

module.exports = {

  // signup page rute
  signup: (req, res) => {
    res.view("pages/signup");
  },

  //create new user that new on site
  create: async (req, res) => {
    //all body input take as variable
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    //create specific member of account as owner
    const role = "Owner";

    //create new user with firstname, lastname, email & password
    await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    });

    //find specific created user with email
    const user = await User.findOne({ email: email });

    //create member with userid and role
    await Accmember.create({ member: user.id, role: role });

    //create account with name and 0 balance and store user id as objectid
    await Account.create({
      account: firstname,
      balance: "0",
      user: user.id,
    }).exec(async (err) => {
      //if user already have account then give error that user already have account
      if (err) {
        req.addFlash("already", "You already have account.");
        res.redirect("/signup");
      } 
      //else send welcome mail 
      else {
        const mail = async () => {
          let transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "887ee8ff35e8ea",
              pass: "14297645cdb92f"
            }
          });

          const sendmailnow = await transport.sendMail({
            from: "manavpadaliatry@gmail.com", // sender address
            to: req.body.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          });

          console.log("Message sent: %s", sendmailnow.messageId);

          console.log(
            "Preview URL: %s",
            nodemailer.getTestMessageUrl(sendmailnow)
          );
        };

        mail().catch((err) => console.log(err));

        //redirect to login after successful signup
        res.redirect("/login");
      }
    });
  },
};
