const express = require("express");
const router = express();
const bodyParser = require("body-parser");
const app = express();
const blogcontroller = require('../controllers/blogcontroller')


//For use body parser at post 
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());


//Add new blog 
router.post("/admin/addblog", urlEncodedParser, blogcontroller.upload, blogcontroller.createNewBlog);


//Add new blog page 
router.get("/admin/addblog", blogcontroller.blogCategory);


//Admin page of all blog
router.get("/admin", blogcontroller.adminBlog);


//All blog page of user
router.get("/", blogcontroller.userBlog);


//Search bar of user panel
router.get("/search", blogcontroller.search);


//Got information of blog to edit it and update it
router.get("/editblog/:id", blogcontroller.blogDetails);

router.get("/updateblog/:id");


//Post the new updated blog
router.post("/updateblog/:id", urlEncodedParser, blogcontroller.upload, blogcontroller.updatedBlog);


//Delete a blog from database base on it's id
router.get("/admin/delete/:id", blogcontroller.deleteBlog);


//Show a specific blog with slug
router.get("/showblog/:slug", blogcontroller.blogSlug);


//export routers
module.exports = router;
