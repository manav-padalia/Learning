var express =require('express');
var app=express()

var path=require('path');
var dirpath=path.join(__dirname,'/public');
app.use(express.static('public'));
var todocontroller=require('./controllers/todocontroller');

app.set('view engine','ejs');
app.use(express.static('./public'));

todocontroller(app);
app.listen(3000);
console.log('hihello');