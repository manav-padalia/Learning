/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require("bcryptjs");

module.exports = {
  attributes: {
    firstname: {
      type: "string",
      required: true,
    },
    lastname: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      isEmail: true,
      unique: true,
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },

    accounts: {
      collection: "account",
      via: "member",
      through: "accmember",
    },

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },

  beforeCreate: (value, next) => {
    bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        throw new Error(err);
      }
      value.password = hash;
      next();
    });
  },

  datastore: "mongodb",
};
