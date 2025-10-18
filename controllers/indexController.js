const { validateSignUp } = require("../middlewares/validator");
const { validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");

function getHomepage(req, res) {
  res.render("home");
}

function getSignUp(req, res) {
  res.render("sign-up-form");
}

const postSignUp = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, password, adminPassword } =
      matchedData(req);

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = Boolean(adminPassword);

    await db.insertNewUser(firstName, lastName, email, hashedPassword, isAdmin);

    res.redirect("/");
  },
];

module.exports = {
  getHomepage,
  getSignUp,
  postSignUp,
};
