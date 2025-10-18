const path = require("node:path");
const express = require("express");
const expressSession = require("express-session");
const indexRouter = require("./routes/indexRouter");
const pgSession = require("connect-pg-simple")(expressSession);
const passport = require("./middlewares/passport");
const pool = require("./db/pool");
require("dotenv").config();

const app = express();
const pgStore = new pgSession({ pool });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  expressSession({
    store: pgStore,
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  }),
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRouter);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
