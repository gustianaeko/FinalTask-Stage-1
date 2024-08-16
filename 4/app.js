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
const renderHome = async (req, res) => {
  try {
    const fecthHeroesWithType = `
    select 
    h.*, t."name" as "Type"
    from "Heroes" h 
    join "Types" t 
    on h."TypeId" = t.id
    order by id ASC`;

    const heroesWithType = await sequelize.query(fecthHeroesWithType);
    const isLogin = req.session.isLogin;

    const heroesObjandIsLogin = heroesWithType[0].map((hero) => {
      return {
        ...hero,
        isLogin,
      };
    });

    await res.render("home", {
      data: heroesObjandIsLogin,
      isLogin: isLogin,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

const renderFormHero = async (req, res) => {
  try {
    const fetchTypeListQuery = `select * from "Types"`;

    const fetchTypeList = await sequelize.query(fetchTypeListQuery);

    await res.render("hero", {
      data: [...fetchTypeList[0]],
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

const createHero = async (req, res) => {
  try {
    const { title, image = req.file.filename, heroType } = req.body;

    const idUser = req.session.idUser;

    const insertHeroQuery = `insert into "Heroes" (name, photo, "UserId", "TypeId" ,"createdAt", "updatedAt")
                            values ('${title}', '${image}', '${idUser}', '${heroType}','now()', 'now()')`;
    await sequelize.query(insertHeroQuery);

    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

const typeList = async (req, res) => {
  try {
    const fecthListquery = `select * from "Types" 
    order by "Types".id ASC`;

    const fetchList = await sequelize.query(fecthListquery);

    const isLogin = req.session.isLogin;

    const typesObjandIsLogin = fetchList[0].map((type) => {
      return {
        ...type,
        isLogin,
      };
    });

    res.render("typeList", {
      data: typesObjandIsLogin,
      isLogin: isLogin,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

const createType = async (req, res) => {
  try {
    const { title } = req.body;
    const insertTypeQuery = `insert into "Types" (name, "createdAt", "updatedAt")
                                values ('${title}', 'now()', 'now()')`;

    await sequelize.query(insertTypeQuery);

    res.redirect("/typeList");
  } catch (err) {
    console.log(err);
  }
};

const renderHeroDetail = async (req, res) => {
  try {
    const id = req.params.heroId;

    const queryHeroDetailById = `
    select 
    h.*, t."name" as "Type"
    from "Heroes" h 
    join "Types" t 
    on h."TypeId" = t.id
    where h.id=${id}
    `;

    const heroById = await sequelize.query(queryHeroDetailById);

    res.render("heroDetail", {
      heroById: heroById[0][0],
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteHero = async (req, res) => {
  try {
    const { heroId } = req.params;
    const deleteQuery = `delete from "Heroes" where id = ${heroId}`;

    await sequelize.query(deleteQuery);

    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

const deleteType = async (req, res) => {
  try {
    const { typeId } = req.params;
    const deleteQuery = `delete from "Types" where id = ${typeId}`;

    await sequelize.query(deleteQuery);

    res.redirect("/typeList");
  } catch (err) {
    console.log(err);
  }
};

const renderFormEditHero = async (req, res) => {
  try {
    const id = req.params.heroId;

    const heroById = await sequelize.query(
      `
    select 
    h.*, t."name" as "Type"
    from "Heroes" h 
    join "Types" t 
    on h."TypeId" = t.id
    where h.id=${id}
    `
    );

    res.render("editHero", {
      data: heroById[0][0],
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

const renderFormEditType = async (req, res) => {
  try {
    const id = req.params.typeId;

    const typeById = await sequelize.query(`
            select * from "Types" t where t.id = ${id}`);

    res.render("editType", {
      data: typeById[0][0],
    });
  } catch (err) {
    console.log(err);
  }
};

const editHero = async (req, res) => {
  try {
    const id = req.params.heroId;

    const editedHero = {
      name: req.body.title,
      type: req.body.heroType,
    };

    const editHeroQuery = `
        update "Heroes"
        set
        "name" = '${editedHero.name}',
        "TypeId" = '${editedHero.type}'
        where id = '${id}'
    `;

    await sequelize.query(editHeroQuery);

    res.redirect("/home");
  } catch (err) {
    console.log(err);
  }
};

const editType = async (req, res) => {
  try {
    const id = req.params.typeId;

    const editedType = {
      name: req.body.title,
    };

    const editTypeQuery = `
          update "Types"
          set
          "name" = '${editedType.name}'
          where id = '${id}'
        `;

    await sequelize.query(editTypeQuery);

    res.redirect("/typeList");
  } catch (err) {
    console.log(err);
  }
};

const renderFormType = async (req, res) => {
  try {
    await res.render("type", {
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
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

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        res.redirect("/register");
      } else {
        const createUser = `INSERT INTO "Users" ("username", "email", "password", "createdAt", "updatedAt") VALUES ('${username}', '${email}', '${hashedPassword}', NOW(), NOW())`;

        await sequelize.query(createUser);

        req.flash("success", "You are successfuly Register");
        res.redirect("/login");
      }
    });
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const queryLoginByEmail = `SELECT * FROM "Users" WHERE email = '${email}'`;

    const isCheckEmail = await sequelize.query(queryLoginByEmail, {
      type: QueryTypes.SELECT,
    });

    if (!isCheckEmail.length) {
      req.flash("danger", "Email is not found");
      return res.redirect("/login");
    }

    bcrypt.compare(password, isCheckEmail[0].password, (err, result) => {
      if (!result) {
        req.flash("danger", "Wrong Password!");
        return res.redirect("/login");
      } else {
        req.session.isLogin = true;
        req.session.user = isCheckEmail[0].username;
        req.session.idUser = isCheckEmail[0].id;
        req.flash("success", "Login Success");

        return res.redirect("/");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res) => {
  req.session.destroy();
  await res.redirect("/");
};

//routes
app.get("/", renderHome);
app.get("/home", renderHome);
app.get("/hero", renderFormHero);
app.get("/typeList", typeList);
app.post("/hero", upload.single("image"), createHero);
app.get("/type", renderFormType);
app.post("/type", createType);
app.get("/register", renderFormRegister);
app.post("/register", registerUser);
app.get("/login", renderFormLogin);
app.post("/login", login);
app.get("/logout", logout);
app.get("/heroDetail/:heroId", renderHeroDetail);
app.get("/editHero/:heroId", renderFormEditHero);
app.post("/editHero/:heroId", editHero);
app.get("/editType/:typeId", renderFormEditType);
app.post("/editType/:typeId", editType);
app.get("/deleteHero/:heroId", deleteHero);
app.get("/deleteType/:typeId", deleteType);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
