const express = require("express");
const router = express();
// const Blog = require("../model/blogmodel");
// const Category = require("../model/categorymodel");
const bodyParser = require("body-parser");
const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

const categoryController = require("../controllers/categorycontroller");

//list of all category that only show to admin
router.get("/admin/category", categoryController.allCategory);

//Page of add new category by admin
router.get("/admin/addcategory", categoryController.addCategory);

// Add new category
router.post("/admin/addcategory/create", urlEncodedParser, categoryController.createCategory);

//Get category name by id from database
router.get("/editcategory/:id", categoryController.getCategory);

//Edit and update category name in database
router.post("/editcategory/:id", urlEncodedParser, categoryController.editCategory);

//Delete category by it's id
router.get("/delete/:id", categoryController.deleteCategory);

module.exports = router;
