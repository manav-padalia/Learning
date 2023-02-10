/**
 * TransactionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  //get all transaction details in transactiondetails page
  transactiondetails: async (req, res) => {
    //take account id from params and declare variable
    const id = req.params.id;
    //find specific account with account id
    const account = await Account.findOne({ id: id });

    //find members of specific account with account id
    const accmember = await Accmember.find({ account: id }).populate("member");

    //take token frm cookies and find user with that token
    let token = req.cookies.jwt;
    const owner = await User.findOne({ token: token });

    //find all transaction with account id and sort with date
    await Transaction.find({
      accountid: id,
    })
      .sort([{ date: "DESC" }])
      .exec((err, transaction) => {
        if (err) {
          res.status(400).json({ err: "db error" });
          console.log(err);
        } else {
          //show acc as account, transaction & accountmember or owner in details of transaction & member
          res.view("pages/transaction/transactiondetails", {
            acc: account,
            transaction: transaction,
            accmember: accmember,
            owner: owner,
          });
        }
      });
  },

  //get add new transaction page
  addtra: async (req, res) => {
    //find account with account id fromarams
    const account = await Account.findOne({ id: req.params.id });

    //find all transactions
    const transaction = await Transaction.find({});

    //get token from cookie and serach user with that
    let token = req.cookies.jwt;
    const owner = await User.findOne({ token: token });

    //show add new transaction page with type of transaction, form action income/expense & owner
    res.view("pages/transaction/addtransaction", {
      user: transaction,
      acc: account,
      owner: owner,
    });
  },

  //create new transaction with balance management
  addtransaction: async (req, res) => {
    //take account id from params and another information from body then declare variable
    const accountid = req.params.id;
    const date = req.body.date;
    const type = req.body.type;
    const description = req.body.description;
    const amount = req.body.amount;
    const createdby = req.body.createdby;

    //find specific account with id then take account balance as oldbalance
    const account = await Account.findOne({ id: accountid });
    oldbalance = account.balance;

    //if the transaction type is income then amount add in oldbalance as a float value and declare that as newbalance
    if (req.body.type === "income") {
      newbalance = oldbalance + parseFloat(amount);

      //take newbalance and create new transaction with date, type(income/expance), description, amount & balance
      await Transaction.create({
        accountid: accountid,
        date: date,
        type: type,
        description: description,
        amount: amount,
        createdby: createdby,
        balance: newbalance,
      }).exec((err) => {
        //if error then database error
        if (err) {
          res.status(500).send({ err: "Database Error" });
        }

        //transaction is generated then show success message
        else {
          req.addFlash("trasuccess", "Transaction added successfully.");
          res.redirect("/transactiondetails/" + accountid);
        }
      });

      //also the updated balance update in account main balance
      await Account.update(accountid, { balance: newbalance });
    }
    //transaction type is expense then take balance form account and minus input amount and save as updatedbalance
    else {
      updatedbalance = oldbalance - amount;
      //if updatedbalance is not negative then create as newbalance and generate transaction with balance management
      if (updatedbalance >= 0) {
        newbalance = updatedbalance;

        await Transaction.create({
          accountid: accountid,
          date: date,
          type: type,
          description: description,
          amount: amount,
          createdby: createdby,
          balance: newbalance,
        }).exec((err) => {
          //if there was some error then that was database error
          if (err) {
            res.status(500).send({ err: "Database Error" });
          }
          //if transaction add successfull then show success message
          else {
            req.addFlash("trasuccess", "Transaction added successfully.");
            res.redirect("/transactiondetails/" + accountid);
          }
        });
        //also the newbalance update in account main balance
        await Account.update(accountid, { balance: newbalance });
      }
      //if account balance is go in negative then that's not possible so give alert to user and redirect ti transiction details
      else {
        req.addFlash(
          "transnotadd",
          "Transaction not add, please check income then expense ."
        );
        res.redirect("/transactiondetails/" + accountid);
      }
    }
  },

  //delete old transaction of account
  delete: async (req, res) => {
    //take transaction id from params
    const id = req.params.id;
    //find transaction with params id and account balance with transaction's account id and declare as old balance
    const transaction = await Transaction.findOne({ id: id });
    const accountbal = await Account.findOne({ id: transaction.accountid });
    const oldbalance = accountbal.balance;

    //if transaction type is expense then transaction amount add in old balance
    if (transaction.type === "expense") {
      newbalance = oldbalance + transaction.amount;
      //destroy transaction with balance updation
      await Transaction.destroy({ id: id }).exec(async (err) => {
        //if error then that was database error
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        //update the balance with distroy transaction and give success message
        else {
          await Account.update(transaction.accountid, { balance: newbalance });
          req.addFlash("tradelete", "Transaction deleted successfully.");
          res.redirect("/transactiondetails/" + transaction.accountid);
        }
      });
    }
    //transaction type is income then check oldamount minus transaction amount
    else {
      updatedbalance = oldbalance - transaction.amount;

      //if updatedbalance is not minus value then delet that transaction
      if (updatedbalance >= 0) {
        newbalance = updatedbalance;

        await Transaction.destroy({ id: req.params.id }).exec(async (err) => {
          if (err) {
            res.send(500, { error: "Database Error" });
          } else {
            //with delete that transaction give success message and update balance of account
            await Account.update(transaction.accountid, {
              balance: newbalance,
            });
            req.addFlash("tradelete", "Transaction deleted successfully.");
            res.redirect("/transactiondetails/" + transaction.accountid);
          }
        });
      }

      //if new balance is go in minus then warn to user
      else {
        req.addFlash(
          "transnotdelete",
          "Transaction not deleted please manage transaction."
        );
        res.redirect("/transactiondetails/" + transaction.accountid);
      }
    }
  },

  //go to transaction edit page
  edit: async (req, res) => {
    //find transactions
    const type = await Transaction.find({});

    //take token from cookie
    let token = req.cookies.jwt;

    //find user from token and show as owner
    const owner = await User.findOne({ token: token });

    //find specific transaction with params id
    await Transaction.findOne({ id: req.params.id }).exec(
      (err, transaction) => {
        if (err) {
          res.send(500, { error: "Database Error" });
        }
        //show edit transaction page with type of transaction, income/expense & owner
        res.view("pages/transaction/edittransaction", {
          transaction: transaction,
          type: type,
          owner: owner,
        });
      }
    );
  },

  //update transaction with balance management
  update: async (req, res) => {
    //take transaction id from params
    const id = req.params.id;
    //declare variable that come from body
    const date = req.body.date;
    const type = req.body.type;
    const description = req.body.description;
    const amount = req.body.amount;
    const createdby = req.body.createdby;

    //find specific transaction from id and take account id & amount of transaction from it
    const transaction = await Transaction.findOne({ id: id });
    const accountid = transaction.accountid;
    const oldamount = transaction.amount;

    //find specific account from account id and take account balance as oldbalance
    const account = await Account.findOne({ id: accountid });
    const oldbalance = account.balance;

    //declare newamount as old transaction amount and amount as input amount minus value
    const newamount = oldamount - amount;

    //if income then declare updatedbalance as old balance of account balance minus new amount
    if (type === "income") {
      updatedbalance = oldbalance - newamount;

      //if updatedbalance is not minus then that save as new balance and update the transaction
      if (updatedbalance >= 0) {
        newbalance = updatedbalance;

        await Transaction.update(id, {
          date: date,
          type: type,
          description: description,
          amount: amount,
          createdby: createdby,
          balance: newbalance,
        }).exec(async (err) => {
          if (err) {
            res.status(500).send({ err: "Database Error" });
          } else {
            //also update account balance and give success message
            await Account.update(accountid, { balance: newbalance });
            req.addFlash("traupdate", "Transaction updated successfully.");
            res.redirect("/transactiondetails/" + accountid);
          }
        });
      }
      //new amount go in to minus then show warning to user
      else {
        req.addFlash(
          "transnotupdate",
          "Transaction not update please check balance then update."
        );
        res.redirect("/transactiondetails/" + accountid);
      }
    }
    //transaction type is expense then addnew amount in oldbalance then check it was not in minus then store it as new balance
    else {
      updatedbalance = oldbalance + newamount;
      if (updatedbalance >= 0) {
        newbalance = updatedbalance;

        //update transaction with new balance
        await Transaction.update(id, {
          date: date,
          type: type,
          description: description,
          amount: amount,
          createdby: createdby,
          balance: newbalance,
        }).exec(async (err) => {
          if (err) {
            //if error then it's database error
            res.status(500).send({ err: "Database Error" });
          } else {
            //account balance as update as transaction updation and give success message and redirect to transaction page
            await Account.update(accountid, { balance: newbalance });
            req.addFlash("traupdate", "Transaction updated successfully.");
            res.redirect("/transactiondetails/" + accountid);
          }
        });
      }
      //updated value go in minus then warn user to manage balance
      else {
        req.addFlash(
          "transnotupdate",
          "Transaction not update please check balance then update."
        );
        res.redirect("/transactiondetails/" + accountid);
      }
    }
  },
};
