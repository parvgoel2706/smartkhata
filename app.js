if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ExpressError = require("./util/ExpressError.js");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRouter = require("./route/user.js");
const accountRouter = require("./route/account.js");
const port = 8080;

let dbURL = `mongodb+srv://${process.env.ATLASDB_USER}:${process.env.ATLASDB_PASSWORD}@cluster0.5ftfw.mongodb.net/smartkhata?retryWrites=true&w=majority&appName=Cluster0`;
// let dbURL = "mongodb://127.0.0.1:27017/smartkhata";
main()
  .then(() => console.log("successfully connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // 24hrs
});

store.on("error", (err) => console.log("Error in MONGO Session Store", err));

const webSession = session({
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  },
});

app.use(webSession);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  res.locals.classLeft = req.path === "/account/dashboard" ? "popUpLeft" : "";
  res.locals.classRight = req.path === "/account/dashboard" ? "popUpRight" : "";
  res.locals.classText = req.path === "/account/dashboard" ? "popUpText" : "";
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use("/account", accountRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page not found");
});

app.use((err, req, res, next) => {
  let { statuscode = 400, message = "Some error occured" } = err;
  res.render("error.ejs", { statuscode, message });
  // next(err);
});

app.listen(port, () => {
  console.log("App is listening to port 8080");
});
