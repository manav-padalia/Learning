const Category = require("../model/categorymodel");

exports.allCategory = (req, res) => {
  //Find category and show that to admin
  Category.find().exec((err, category) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("Allcategory", {
        category: category,
      });
    }
  });
};

exports.addCategory = (req, res) => {
  res.render("Addcategory");
};

exports.createCategory = (req, res) => {
  const newcategory = new Category({
    categoryname: req.body.categoryname,
  });
  newcategory.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      res.redirect("/admin/category");
    }
  });
};

exports.getCategory = (req, res) => {
  let id = req.params.id;
  Category.findById(id, (err, categoryname) => {
    if (err) {
      res.redirect("/admin/category");
    } else {
      if (categoryname == null) {
        res.redirect("/admin/category");
      } else {
        res.render("Editcategory", {
          categoryname: categoryname,
        });
      }
    }
  });
};

exports.editCategory = (req, res) => {
  let id = req.params.id;
  Category.findByIdAndUpdate(
    id,
    {
      categoryname: req.body.categoryname,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        res.redirect("/admin/category");
      }
    }
  );
};

exports.deleteCategory = (req, res) => {
  let id = req.params.id;
  Category.findByIdAndRemove(id, (err, result) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.redirect("/admin/category");
    }
  });
};
