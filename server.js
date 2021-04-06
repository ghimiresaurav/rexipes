const express = require("express");
const mysql = require("mysql");
const path = require("path");
const multer = require("multer");
const mysqldump = require("mysqldump");
const fs = require("fs");

const app = express();

// app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "1mb" }));

const db = mysql.createConnection({
  host: "localhost",
  user: "saurav",
  password: "123456",
  database: "recipes",
  insecureAuth: true,
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const recipes = db.query(`SELECT * FROM recipes`, async (err, result) => {
        if (err) throw err;
        const dir = path.join(
          __dirname,
          `public/uploads/images/post-${result.length + 1}`
        );

        fs.access(dir, (err) => {
          if (err) {
            return fs.mkdir(dir, (err) => cb(err, dir));
          } else return cb(null, dir);
        });
      });
    },
    filename: (req, file, cb) => {
      cb(null, `img-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

app.get("/view", (req, res) => {
  const tableName = "recipes";
  let data;
  const sql = `SELECT * FROM ${tableName};`;
  db.query(sql, async (err, result) => {
    if (err) throw err;

    data = result.reduce((all, elem) => {
      db.query(
        `SELECT * FROM user_details WHERE user_id = ${elem.user_id}`,
        async (err, re) => {
          if (err) throw err;

          all.push({
            username: re[0].user_name,
            title: elem.title,
            ingredients: elem.ingredients.split(", "),
            description: elem.description,
          });
        }
      );
      return all;
    }, []);
    setTimeout(() => res.send(JSON.stringify(data)), 5);
  });
});

//recipe_id(PRIMARY KEY), description, ingredients, user_id
//user_id(PRIMARY KEY), user_name
//recipe_id, images

app.post("/new-recipe", upload.array("images"), (req, res) => {
  console.log("here");
  const { files } = req;
  const recipe = req.body;
  console.log(recipe);

  if (files.length) {
    const links = files.reduce(
      (paths, elem) => `${paths}, ${elem.path.replace(/\\/g, "/")}`,
      ``
    );
    const id = parseInt(files[0].destination.split("-")[1]);
    const sql = `INSERT INTO images (recipe_id, links) VALUES ('${id}', '${links}')`;
    console.log(sql);
    db.query(sql);
  } else console.log("nofiles");
  //check whether user exists or not
  db.query(
    `SELECT * FROM user_details WHERE user_name = '${recipe.username}';`,
    async (err, result) => {
      if (err) throw err;

      if (!result.length) {
        //user doesn't exit
        //add the user to database
        db.query(
          `INSERT INTO user_details (user_name) VALUES ('${recipe.username}');`
        );
      }
    }
  );

  //add the new recipe to database after 20 milliseconds
  setTimeout(() => {
    db.query(
      `SELECT * FROM user_details WHERE user_name = '${recipe.username}';`,
      async (err, result) => {
        if (err) throw err;
        console.log(result);
        const sql = `INSERT INTO recipes (title, ingredients, description, user_id) VALUES
       ('${recipe.title}', '${recipe.ingredients}', '${recipe.description}', '${result[0].user_id}');`;
        console.log(sql);
        db.query(sql);
      }
    );
  }, 20);

  mysqldump({
    connection: {
      host: "localhost",
      user: "saurav",
      password: "123456",
      database: "recipes",
    },
    dumpToFile: "./dump.txt",
  });
});

app.post("/images", upload.array("images"), (req, res) => {
  const { files, body } = req;
  console.log(files, body);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
