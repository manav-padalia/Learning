const express = require('express');
// const exphbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')
// var expressValidator = require('express-validator')
const app = express();
const port = process.env.PORT|| 3310;
const router = require('./src/routes/index')
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
// app.engine('hbs', exphbs.engine({extname:".hbs"}))
app.set('view engine', 'ejs');
app.use('/', router)
// console.log(port);
app.get('/', (req, res)=>{
    res.render('home')
})

const connect = require("./db");

connect
  .sync()
  .then()
  .catch(err => {
  console.log(err);
});

app.listen(port, ()=>{
    console.log(`The server is listening on port ${port}`);
})
