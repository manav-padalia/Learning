const Sequelize =require('sequelize');
const db = new Sequelize('manavp', 'manavp', 'M04eRtb83ibL9yy3pP6vlRQYVXtbvbvbv',{
    host:"15.206.7.200",
    port: 3310,
    dialect:"mysql",
    define: {
        freezeTableName: true
      }
});

// db.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
//  }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
//  });

module.exports= db;
