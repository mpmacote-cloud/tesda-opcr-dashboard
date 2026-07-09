const bcrypt = require("bcrypt");
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

router.post("/", async (req, res) => {

  try {

    const {
      username,
      password,
      role
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (username,password,role) VALUES (?,?,?)",
      [username, hashedPassword, role],
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

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false
    });

  }

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



/* router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [results] = await db.query(
      "SELECT id, username, password, role FROM users WHERE username = ?",
      [username]
    );

    if (results.length === 0) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const user = results[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    res.json({
      success: true,
      username: user.username,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
}); */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("LOGIN REQUEST:");
    console.log("Username:", username);
    console.log("Password entered:", password);

    const [results] = await db.query(
      "SELECT id, username, password, role FROM users WHERE username = ?",
      [username]
    );

    console.log("User found:", results.length);

    if (results.length === 0) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const user = results[0];

    console.log("Stored hash:", user.password);

    const validPassword = await bcrypt.compare(password, user.password);

    console.log("Password match:", validPassword);

    if (!validPassword) {
      return res.json({
        success: false,
        message: "Invalid username or password."
      });
    }

    res.json({
      success: true,
      username: user.username,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});

module.exports = router;