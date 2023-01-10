const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const Category = require("./server/model/categorymodel");
const Blog = require("./server/model/blogmodel");
app.use("", require("./server/routes/loginroutes"));
app.use("", require("./server/routes/categoryroutes"));
app.use("", require("./server/routes/blogroutes"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("uploads"));



//view engine connection
app.set("view engine", "ejs");
// app.set("views".path.resolve(__dirname, "views"))

//connect mongodb & mongoose as database (new method)
const { MongoClient, Admin } = require("mongodb");
mongoose.set("strictQuery", false);
// const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/BlogSite",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("Connected to DB");
    } else {
      console.log("Database connection error");
    }
  }
);

//use for external css
app.use(express.static(__dirname + "/public"));


//create port for local
const port = 3310;
app.listen(port, () => {
  console.log(`Server run on http://localhost:${port}`);
});
