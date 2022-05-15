const express = require("express");
const router = express.Router();
const db = require("../dbConnection");

router.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, rows, fields) => {
    if (!err) res.send(rows);
    else console.log(err);
  });
});

router.post("/products",  (req, res, next) => {
  db.query(
    `SELECT * FROM products WHERE id_product = (${db.escape(req.body.id_product)});`,
    (err, result) => {
      if (result.length) {
        return res.status(401).send({
          msg: "Product ID already in used!",
        });
      } else {
        db.query(
          `INSERT INTO products (account_id, id_product, name_product, quantity,price) VALUES ( ${db.escape(
            req.body.account_id)},${db.escape(
            req.body.id_product
          )}, 
            ${db.escape(req.body.name_product)}, ${db.escape(
            req.body.quantity
          )}, ${db.escape(req.body.price)}) `,
          (err, result) => {
            if (err) {
                  return res.status(400).send({
                  msg: err
              });
            }

            return res.status(201).send({
              msg: "Product has been added",
            });
          }
        );
      }
    }
  );
});

router.delete("/products", function (req, res) {
  let productsID = req.body.id_product;
  db.query(
    "SELECT * FROM products WHERE id_product = ?",
    [productsID],
    (err, result) => {
      if (result.length <= 0) {
        return res.status(404).send({
          msg: "Product ID is not found",
        });
      } else {
        db.query(
          "DELETE FROM products WHERE id_product = ?",
          [productsID],
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
    }
  );
});

router.put("/products", function (req, res) {
  let productsID = req.body.id_product;
  db.query(
    "SELECT * FROM products WHERE id_product = ?",
    [productsID],
    (err, result) => {
      if (result.length <= 0) {
        return res.status(404).send({
          msg: "Product ID is not found",
        });
      } else {
        db.query(
          `UPDATE  products set name_product = ${db.escape(
            req.body.name_product
          )}, quantity = ${db.escape(req.body.quantity)}, 
          price = ${db.escape(req.body.price)} where id_product =${result[0].id_product}`,
          function (error, results, fields) {
            if (error) throw error;
            return res.send({
              error: false,
              data: results,
              message: "User has been update successfully.",
            });
          }
        );
      }
    }
  );
});

module.exports = router;
