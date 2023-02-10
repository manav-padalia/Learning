/**
 * MemberController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

// const { CLIENT_RENEG_LIMIT } = require("tls");
// const Accmember = require("../models/Accmember");
// const Member = require("../models/Member");

module.exports = {
  //add new member from find user
  addmember: async (req, res) => {
    //fetch token from cookies
    const token = req.cookies.jwt;

    //find specific user as member
    const member = await User.findOne({
      email: req.body.email,
    });

    //find specific account from id
    const account = await Account.findOne({
      id: req.params.id,
    });

    //find account members with account id
    const accountmember = await Accmember.find({
      account: account.id,
    });

    //if email or account member is not metch with user mail then give error
    if (!member) {
      req.addFlash("invalid", "Invaild email id");
      return res.redirect("/transactiondetails/" + account.id);
    }
    if (!accountmember) {
      req.addFlash("invalid", "Invaild email id");
      return res.redirect("/transactiondetails/" + account.id);
    }

    //if member token and user token is same then owner was already in list
    if (member.token === token) {
      req.addFlash("invalid", "Owner was already exists");
      res.redirect("/transactiondetails/" + account.id);
    }

    //accountmembers find with member id and account id
    const memname = await Accmember.find({
      member: member.id,
      account: account.id,
    });

    //account member find then it's in database so give error
    if (memname.length != 0) {
      req.addFlash("invalid", "Member already exists");
      res.redirect("/transactiondetails/" + account.id);
    } else {
      //if member not find then create new member in database as member
      let role = "Member";
      const members = await Accmember.create({
        member: member.id,
        account: account.id,
        role: role,
      }).fetch();

      //if member add successfull then show success message
      if (members) {
        req.addFlash("membersuccess", "Member added successfully.");
        res.redirect("/transactiondetails/" + account.id);
      }
      //if email or account member is not metch with user mail then give error
      else {
        req.addFlash("invalid", "Invaild email exists");
        res.redirect("/transactiondetails/" + account.id);
      }
    }
  },

  //delete specific member from database
  deletemember: async (req, res) => {
    //find member with params id
    const member = await Accmember.findOne({ id: req.params.id });
    //delete specific member
    await Accmember.destroy({ id: req.params.id }).exec((err) => {
      if (err) {
        res.send(500, { error: "Database Error" });
      }
      //give success message to user
      else {
        req.addFlash("memberdelete", "Member deleted successfully.");
        res.redirect("/transactiondetails/" + member.account);
      }
    });
    return false;
  },
};
