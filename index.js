// const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const rAccounts = require("./routes/router_accounts");
const rProducts = require("./routes/router_products");

const app = express();

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use("/", rAccounts);
app.use("/", rProducts);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 400;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

app.listen(3000, () => console.log("Server is running"));
