const { Sequelize } = require("sequelize");
const db = require('../../db');


module.exports = db.define('course', {
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        // allowNull: true,
        primaryKey:true
    },
    Course_name:{
        type: Sequelize. STRING,
        allowNull: true,
        //unique: false,
        // defaultValue: 'yfgewd'
    },
    Duration: {
        type: Sequelize. STRING,
        allowNull: true,
       // unique: false,
        // defaultValue: 'yfgewd'
    },
    Fees: {
        type:Sequelize. STRING,
        allowNull: true,
       // unique: false,
        // defaultValue: 'yfgewd'
    },
})
// module.exports = db;