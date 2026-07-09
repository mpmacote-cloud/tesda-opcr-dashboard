const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET ALL USERS ================= */
router.get("/", (req, res) => {

  db.query(
    `
    SELECT
      id,
      username,
      role
    FROM users
    ORDER BY id ASC
    `,
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Unable to retrieve users."
        });
      }

      res.json(results);

    }
  );

});

/* ================= CREATE USER ================= */

router.post("/", (req, res) => {

  const {
    username,
    password,
    role
  } = req.body;

  db.query(
    "INSERT INTO users (username,password,role) VALUES (?,?,?)",
    [username, password, role],
    (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        id: result.insertId
      });

    }
  );

});

/* ================= UPDATE USER ================= */

router.put("/:id", (req, res) => {

  const { username, password, role } = req.body;

  db.query(
    `UPDATE users
     SET username=?, password=?, role=?
     WHERE id=?`,
    [
      username,
      password,
      role,
      req.params.id
    ],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json({
        success: true
      });

    }
  );

});

/* ================= DELETE USER ================= */

router.delete("/:id", (req, res) => {

  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json({
        success: true
      });

    }
  );

});

/* ================= LOGIN ================= */

router.post("/login", (req, res) => {

  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, results) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false
        });
      }

      if (results.length === 0) {
        return res.json({
          success: false
        });
      }

      res.json({
        success: true,
        role: results[0].role,
        username: results[0].username
      });

    }
  );

});

module.exports = router;