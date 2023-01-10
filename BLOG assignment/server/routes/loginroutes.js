const express = require("express");
const router = express();

const loginController = require("../controllers/logincontroller");
const { Admin } = require("mongodb");

//Login page with static user through database
router.get("/login", loginController.adminIdPass);


//Logout admin and render to login page
router.get('/logout', loginController.logout)
















module.exports = router;
