const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("../middlewares/passport");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const validate = require("../middlewares/validator");
const { validationResult, matchedData } = require("express-validator");

async function getHomepage(req, res) {
  const messages = await db.getAllMessages();

  const isMemberOrAdmin =
    req.isAuthenticated() && (req.user.is_member || req.user.is_admin);

  const isAdmin = req.isAuthenticated() && req.user.is_admin;

  if (!messages) {
    throw new CustomNotFoundError("No Messages Found!");
  }

  res.render("home", { messages, isMemberOrAdmin, isAdmin });
}

function getSignUp(req, res) {
  res.render("sign-up-form");
}

const postSignUp = [
  validate.signUp,
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

function postLogIn(req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("log-in-form", { info });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
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
  validate.membership,
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

function messageGet(req, res) {
  res.render("message-form");
}

const messagePost = [
  validate.message,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("message-form", {
        errors: errors.array(),
      });
    }

    const { id } = req.user;
    const { title, message } = req.body;
    await db.insertNewMessage(message, title, id);
    res.redirect("/");
  },
];

async function deleteMessage(req, res) {
  const { msgId } = req.params;
  await db.deleteMessage(msgId);
  res.redirect("/");
}

module.exports = {
  getHomepage,
  getSignUp,
  postSignUp,
  getLogIn,
  postLogIn,
  getLogOut,
  membershipGet,
  membershipPost,
  messageGet,
  messagePost,
  deleteMessage,
};
