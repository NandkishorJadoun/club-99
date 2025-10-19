const { Router } = require("express");
const indexController = require("../controllers/indexController");
const passport = require("../middlewares/passport");
const isAuth = require("../middlewares/authMiddleware");

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
indexRouter.get("/log-out", isAuth, indexController.getLogOut);
indexRouter.get("/membership", isAuth, indexController.membershipGet);
indexRouter.post("/membership", indexController.membershipPost);
indexRouter.get("/message", isAuth, indexController.messageGet);
indexRouter.post("/message", indexController.messagePost);

module.exports = indexRouter;
