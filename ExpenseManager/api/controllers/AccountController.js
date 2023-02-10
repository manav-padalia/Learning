/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  //Show account details after user login.
  user: async (req, res) => {
    //take token that save in web cookies
    const token = req.cookies.jwt;

    //find specific user with token
    const user = await User.findOne({ token: token });

    //find account with user id
    await Account.find({ user: user.id }).exec((err, account) => {
      if (err) {
        res.status(400).send({ err: "db error" });
      } else {
        //show account data with account
        res.view("pages/account/userhome", { account: account });
      }
    });
  },

  //Add new account
  addaccount: async (req, res) => {
    //take accountname from body as account
    const account = req.body.account;

    //take token that save in web cookies
    const token = req.cookies.jwt;

    //find specific user with token
    const user = await User.findOne({ token: token });

    //find accounts account with name and user id
    const accname = await Account.find({
      account: account,
      user: user.id,
    });

    //if accountname is match with specific user's account name then give error.
    if (accname.length != 0) {
      req.addFlash("accunsuccess", "Account already exist.");
      res.redirect("/user");
    }

    //if account is not exist then create new account
    else {
      await Account.create({
        account: account,
        user: user.id,
      });
      //account created success message
      req.addFlash("accsuccess", "Account added successfully.");

      //show that on /user page
      res.redirect("/user");
    }
  },

  //delete account with details
  delete: async (req, res) => {
    //delete specific account with their id take from params
    await Account.destroy({ id: req.params.id }).exec((err) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      } else {
        //account created success message
        req.addFlash("accdelete", "Account deleted successfully.");

        //show that on /user page
        res.redirect("/user");
      }
    });
    return false;
  },

  //For edit some accountant name go for edit page with saved details
  edit: async (req, res) => {
    //find specific account with id take from params
    await Account.findOne({ id: req.params.id }).exec((err, account) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      //take specific accountname and show at edit page
      res.view("pages/account/editaccount", { account: account });
    });
  },

  //Update accountant name in account data
  update: async (req, res) => {
    //take account id from params and account from body, then declare specific variable
    const id = req.params.id;
    const account = req.body.account;

    //update account details with accountname
    await Account.update(id, {
      account: account,
    }).exec((err) => {
      //if accountname is already exists then give error that account is already exists
      if (err) {
        req.addFlash(
          "accnotupdate",
          "Account not update because it's already exists in your data."
        );
        res.redirect("/user");
      }
      //if account is update then give success message at /user page
      else {
        req.addFlash("accupdate", "Account updated successfully.");
        res.redirect("/user");
      }
    });
  },
};
