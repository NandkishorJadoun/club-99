const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = new Router();

indexRouter.get("/", indexController.getHomepage);
indexRouter.get("/sign-up", indexController.getSignUp);
indexRouter.post("/sign-up", indexController.postSignUp);
indexRouter.get("/log-in", indexController.getLogIn);

module.exports = indexRouter;
