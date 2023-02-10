/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  //show home page
  "/": { view: "pages/homepage" },

  //show login page
  "GET /login": "LoginController.login",
  //login user authantication
  "POST /success": "LoginController.loginauth",
  //logout user
  "GET /logout": "LoginController.logout",

  //show signup page
  "GET /signup": "UserController.signup",
  //create new user
  "POST /newuser": "UserController.create",

  //get account information
  "GET /user": "AccountController.user",
  //add new account
  "POST /add": "AccountController.addaccount",
  //delete specific account
  "GET /delete/:id": "AccountController.delete",
  //go to edit account with details of specific account
  "GET /edit/:id": "AccountController.edit",
  //update account details
  "POST /update/:id": "AccountController.update",

  //get transaction information of specific account
  "GET /transactiondetails/:id": "TransactionController.transactiondetails",
  //show new transaction page
  "GET /addtransaction/:id": "TransactionController.addtra",
  //add new transaction of specific account
  "POST /addtransaction/:id": "TransactionController.addtransaction",
  //delete specific transaction
  "GET /deletetransaction/:id": "TransactionController.delete",
  //go to edit transaction with details of specific transaction
  "GET /edittransaction/:id": "TransactionController.edit",
  //update transaction details
  "POST /updatetransaction/:id": "TransactionController.update",

  //create new member
  "POST /addmember/:id": "MemberController.addmember",
  //delete specific member
  "GET /deletemember/:id": "MemberController.deletemember",

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
