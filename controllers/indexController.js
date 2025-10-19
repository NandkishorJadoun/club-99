const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const {
  validateSignUp,
  validateMembership,
} = require("../middlewares/validator");
const { validationResult, matchedData } = require("express-validator");

function getHomepage(req, res) {
  res.render("home", { user: req.user });
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

    if (!hashedPassword) {
      throw new CustomNotFoundError("Hashing Password is not working");
    }

    const isAdmin = Boolean(adminPassword);

    await db.insertNewUser(firstName, lastName, email, hashedPassword, isAdmin);

    res.redirect("/");
  },
];

function getLogIn(req, res) {
  res.render("log-in-form");
}

function getLogOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

function membershipGet(req, res) {
  res.render("membership-form");
}

const membershipPost = [
  validateMembership,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("membership-form", {
        errors: errors.array(),
      });
    }

    const { id } = req.user;
    await db.updateMembership(id);
    res.redirect("/");
  },
];

module.exports = {
  getHomepage,
  getSignUp,
  postSignUp,
  getLogIn,
  getLogOut,
  membershipGet,
  membershipPost,
};
