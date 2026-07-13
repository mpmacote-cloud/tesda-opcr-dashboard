const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET ALL USERS ================= */
router.get("/", async (req, res) => {
  try {

    const [results] = await db.query(`
      SELECT
        id,
        username,
        role
      FROM users
      ORDER BY id ASC
    `);

    res.json(results);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve users."
    });

  }
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

    const [result] = await db.query(
      "INSERT INTO users (username,password,role) VALUES (?,?,?)",
      [username, hashedPassword, role]
    );

    res.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false
    });

  }
});

/* ================= UPDATE USER ================= */

router.put("/:id", async (req, res) => {
  try {

    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `UPDATE users
       SET username=?, password=?, role=?
       WHERE id=?`,
      [
        username,
        hashedPassword,
        role,
        req.params.id
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }
});

/* ================= DELETE USER ================= */

router.delete("/:id", async (req, res) => {
  try {

    await db.query(
      "DELETE FROM users WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json(err);

  }
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

  const token = jwt.sign(
  {
    id: user.id,
    username: user.username,
    role: user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "8h"
  }
);

res.json({
  success: true,
  username: user.username,
  role: user.role,
  token
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