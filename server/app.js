const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const DbDriver = require("./db-driver");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

const db = new DbDriver("db.json");

const getHostLink = (req, _port) => {
  return `${req.protocol}://${req.get("host")}`;
};

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
app.get("/",(req,res)=>{
    res.status(401).send("Opps!")
})
app.use(express.static(path.join(__dirname, "..", "build")));

app.get("/generate-url", (req, res) => {
  let name = req.query.name;
  let uniqueId = "--";
  do {
    uniqueId = uuidv4().replace(/-/g, "");
  } while (db.hasKey(uniqueId));

  db.addKey(uniqueId, name);
  db.connect(); // refresh
  const uniqueUrl = `${getHostLink(req, port)}/${uniqueId}`;
  res.json({ url: uniqueUrl });
});

app.get("/url-list", (req, res) => {
  let keys = db.keys(getHostLink(req, port) + "/");
  res.json({ data: keys });
});

app.post("/:api_key", (req, res) => {
  const api_key = req.params.api_key;
  const body = req.body;
  try {
    if (!body) throw Error("Invalid Body");
    db.setValue(api_key, body);
    res.end();
  } catch (error) {
    res.status(415).send(error.message);
  }
});

app.get("/:api_key/view", (req, res) => {
  const api_key = req.params.api_key;
  const data = db.getValue(api_key);
  if (!data) {
    res.status(404).json({
      error: "No data found for the given API Key",
    });
  }
  res.json({ data });
});

app.listen(port, () => {
  db.connect();
  console.log(`App listening at http://localhost:${port}`);
});
