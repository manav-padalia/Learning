/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions, unless overridden.       *
   * (`true` allows public access)                                            *
   *                                                                          *
   ***************************************************************************/

  // '*': 'Auth',
  LoginController: {
    logout: "Auth",
  },
  AccountController: {
    // Apply the 'isLoggedIn' policy to the 'update' action of 'UserController'
    "*": "Auth",
  },
  MemberController: {
    // Apply the 'isLoggedIn' policy to the 'update' action of 'UserController'
    "*": "Auth",
  },
  TransactionController: {
    // Apply the 'isLoggedIn' policy to the 'update' action of 'UserController'
    "*": "Auth",
  },
};
