const { Router } = require("express");
const indexController = require("../controllers/indexController");
const passport = require("../middlewares/passport");

const indexRouter = new Router();

indexRouter.get("/", indexController.getHomepage);
indexRouter.get("/sign-up", indexController.getSignUp);
indexRouter.post("/sign-up", indexController.postSignUp);
indexRouter.get("/log-in", indexController.getLogIn);
indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  }),
);
indexRouter.get("/log-out", indexController.getLogOut)

module.exports = indexRouter;
