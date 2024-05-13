import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user:"postgres",
  host: "localhost",
  database: "Todo",
  password: "123456",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

// get: home
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items")
  const items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
 // items.push({ title: item }); //
  try {
       await db.query(
"INSERT INTO items (title) VALUES ($1)",[item]
  );
 
  res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  const update = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [update, id]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

});

app.post("/delete", async (req, res) => {
  const deleteId = req.body.deleteItemId;

  try {
    await db.query("DELETE FROM items WHERE id = $1", [deleteId]);
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
