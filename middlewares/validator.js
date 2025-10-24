const { body } = require("express-validator");
const { getUserByEmail } = require("../db/queries");
require("dotenv").config();

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emptyErr = "shouldn't be empty.";

const signUp = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage(`First name ${emptyErr}`)
    .isAlpha("en-US")
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage(`Last name ${emptyErr}`)
    .isAlpha("en-US")
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),

  body("email")
    .isEmail()
    .withMessage("Enter a valid email.")
    .custom(async (email) => {
      const user = await getUserByEmail(email);
      if (user) {
        throw new Error("E-mail already in use.");
      }
      return true;
    }),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Minimum Length of Password should be 6 Characters."),

  body("confirmPassword").custom((password, { req }) => {
    if (password !== req.body.password) {
      throw new Error("Both Passwords are not matching.");
    }
    return true;
  }),

  body("adminPassword")
    .optional({ values: "falsy" })
    .custom((password) => {
      if (password !== process.env.ADMIN_PW) {
        throw new Error("Invalid Admin Password");
      }
      return true;
    }),
];

const membership = [
  body("membership").custom((password) => {
    if (password !== process.env.MEMBERSHIP_PW) {
      throw new Error("Invalid Membership Password");
    }
    return true;
  }),
];

const message = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage(`Title ${emptyErr}`)
    .isAlpha("en-US", { ignore: " " })
    .withMessage(`Title ${alphaErr}`)
    .isLength({ max: 40 })
    .withMessage("Title length must be smaller than 40 characters."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage(`Message ${emptyErr}`)
    .isLength({ max: 1000 })
    .withMessage("Message length must be smaller than 1000 characters."),
];

module.exports = {
  signUp,
  membership,
  message,
};
