const Blog = require("../model/blogmodel");
const Category = require("../model/categorymodel");
const multer = require("multer");
const fs = require("fs");

exports.createNewBlog = (req, res) => {
  let imageData;
  //Upload image as it's file name
  if (req.file) {
    imageData = req.file.filename;
  } else {
    imageData = "";
  }

  // Generate slug
  const slugify = req.body.blogtitle;
  const slug = slugify
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  //Upload blog data to database
  const blog = new Blog({
    blogtitle: req.body.blogtitle,
    blogcategory: req.body.blogcategory,
    blogdiscription: req.body.blogdiscription,
    image: imageData,
    slug: slug,
  });

  blog.save(() => {
    //Add blog and show at admin panel
    res.redirect("/admin");
  });
};

exports.userBlog = async (req, res) => {
  Blog.find()
    .sort({
      uploaddate: "desc",
    })
    .populate("blogcategory")
    .exec((err, blogs) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("Home", {
          blogs: blogs,
        });
      }
    });
};

exports.adminBlog = (req, res) => {
  Blog.find()
    .populate("blogcategory")
    .exec((err, blogs) => {
      if (err) {
        res.json({ message: err.message });
      } else {
        res.render("Admin", {
          blogs: blogs,
        });
      }
    });
};

exports.blogCategory = (req, res) => {
  let id = req.params.id;
  Category.find((err, category) => {
    if (err) {
      res.redirect("/admin");
    } else {
      res.render("Addblog", {
        category: category,
      });
    }
  });
};

exports.search = async (req, res) => {
  try {
    let search = " ";
    if (req.query.search) {
      search = req.query.search;
    }
    await Blog.find({
      $or: [{ blogtitle: { $regex: ".*" + search + ".*", $options: "i" } }],
    })
      .sort({
        uploaddate: "desc",
      })
      .populate("blogcategory")
      .then((blogs) => {
        res.render("Home", {
          blogs: blogs,
        });
      });
  } catch (error) {
    console.log(error.message);
  }
};

exports.blogSlug = (req, res) => {
  let slug = req.params.slug;
  Blog.find({ slug }, (err, blogtitle) => {
    if (err) {
      res.redirect("/");
    } else {
      if (blogtitle == null) {
        res.redirect("/");
      } else {
        res.render("Showblog", {
          blogtitle: blogtitle,
        });
      }
    }
  }).populate("blogcategory");
};

exports.blogDetails = async (req, res) => {
  let id = req.params.id;
  const category = await Category.find().exec();
  Blog.findById(id, (err, blogtitle) => {
    if (err) {
      res.redirect("/admin");
    } else {
      res.render("Editblog", {
        blogtitle: blogtitle,
        category: category,
      });
    }
  });
};

exports.updatedBlog = (req, res) => {
  const slugify = req.body.blogtitle;
  const slug = slugify
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  let id = req.params.id;
  let new_image;
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlink(
        "uploads/" + req.body.old_image,
        (error) => error && console.error(error)
      );
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  Blog.findByIdAndUpdate(
    id,
    {
      blogtitle: req.body.blogtitle,
      blogcategory: req.body.blogcategory,
      blogdiscription: req.body.blogdiscription,
      image: new_image,
      slug: slug,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        res.redirect("/admin");
      }
    }
  );
};

exports.deleteBlog = (req, res) => {
  let id = req.params.id;
  Blog.findByIdAndRemove(id, (err, result) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.redirect("/admin");
    }
  });
};

//For blog creation date
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

//For upload image of blog
exports.upload = multer({
  storage: storage,
}).single("image");
