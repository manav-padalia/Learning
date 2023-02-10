const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    await jwt.verify(token, "secret");
    next()
  } catch (error) {
    res.view('pages/login')
  }
};
