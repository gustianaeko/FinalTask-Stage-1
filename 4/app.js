const express = require("express");
const app = express();
const port = 3000;

//import bcrypt , session, flash, multer
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const multer = require("multer");

//multerConfig
const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const uniqSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqSuffix + ".jpg");
  },
});

const upload = multer({ storage: multerConfig });

//sequelize config
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize("stage1FinalTaskNo4", "postgres", "postgres", {
  host: "127.0.0.1",
  dialect: "postgres",
});

//flash and session
app.use(flash());
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: false,
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: "luckyCat",
  })
);

//view engine
app.set("view engine", "hbs");
app.set("views", "views");

//static file access and uploads
app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("src/uploads"));

//body parser (parse from string to obj)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//data and controllers
const heroes = [];

const renderHome = async (req, res) => {
  try {
    await res.render("home");
  } catch (err) {
    console.log(err);
  }
};

const renderFormHero = async (req, res) => {
  try {
    await res.render("hero");
  } catch (err) {
    console.log(err);
  }
};

const renderFormType = async (req, res) => {
  try {
    await res.render("type");
  } catch (err) {
    console.log(err);
  }
};

const renderFormRegister = async (req, res) => {
  try {
    await res.render("register");
  } catch (err) {
    console.log(err);
  }
};

const renderFormLogin = async (req, res) => {
  try {
    await res.render("login");
  } catch (err) {
    console.log(err);
  }
};

//routes
app.get("/", renderHome);
app.get("/home", renderHome);
app.get("/hero", renderFormHero);
app.get("/type", renderFormType);
app.get("/register", renderFormRegister);
app.get("/login", renderFormLogin);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
