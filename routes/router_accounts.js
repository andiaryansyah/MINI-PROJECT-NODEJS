const express = require("express");
const router = express.Router();
const db = require("../dbConnection");
const { signupValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/accounts", (req, res) => {
  db.query("SELECT * FROM accounts", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

router.delete("/accounts", function (req, res) {
  let name = req.body.name;
  db.query("SELECT * FROM accounts WHERE name = ?", [name], (err, result) => {
    if (result.length <= 0) {
      return res.status(404).send({
        msg: "Username is not found",
      });
    } else {
      db.query(
        "DELETE FROM accounts WHERE name = ?",
        [name],
        function (error, results, fields) {
          if (error) throw error;
          return res.send({
            error: false,
            data: results,
            message: "User has been deleted successfully.",
          });
        }
      );
    }
  });
});

router.post("/accounts/register", signupValidation, (req, res, next) => {
  let dt = new Date();
  db.query(
    `SELECT * FROM accounts WHERE name = (${db.escape(req.body.name)});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: "This user is already in use!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(400).send({
              msg: err,
            });
          } else {
            db.query(
              `INSERT INTO accounts (name, password, address,join_date, phone_number) VALUES ( ${db.escape(
                req.body.name
              )}, 
            ${db.escape(hash)}, ${db.escape(req.body.address)}, ${db.escape(
                dt 
              )}, 
            ${db.escape(req.body.phone_number)}) `,
              (err, result) => {
                if (err) {
                      return res.status(400).send({
                      msg: err
                  });
                }

                return res.status(201).send({
                  msg: "The user has been registered!",
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post("/accounts/login", loginValidation, (req, res, next) => {
  db.query(
    `SELECT * FROM accounts WHERE name = ${db.escape(req.body.name)};`,
    (err, result) => {
      if (err) {
        return res.status(400).send({
        msg: err
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: "Username or password is incorrect!",
        });
      }
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status(401).send({
            msg: 'Username or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign(
              { id: result[0].id },
              "the-super-strong-secrect",
              { expiresIn: "1h" }
            );
            return res.status(200).send({
              msg: "Logged in!",
              token,
              user: result[0],
            });
          }
          return res.status(401).send({
            msg: "Username or password is incorrect!",
          });
        }
      );
    }
  );
});

router.post("/accounts/get-user", signupValidation, (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer") ||
    !req.headers.authorization.split(" ")[1]
  ) {
    return res.status(401).json({
      message: "Please provide the token",
    });
  }
  const theToken = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(theToken, "the-super-strong-secrect");
  db.query(
    "SELECT * FROM accounts where id=?",
    decoded.id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results[0],
        message: "Fetch Successfully.",
      });
    }
  );
});

module.exports = router;
