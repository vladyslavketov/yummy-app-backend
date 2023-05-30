const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const authRouter = require("./routes/api/users");
const recipesRouter = require("./routes/api/recipes");

const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
// app.use(cors({origin: 'http://localhost:3000'}));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", authRouter);
app.use("/api/recipes", recipesRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});
app.use((err, req, res, next) => {
  const { status } = err;

  if (!status) status = 500;

  res.status(status).json({ message: err.message });
});

module.exports = app;
