const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");

/* ================= GET ALL USERS ================= */
router.get(
  "/",
  authenticateToken,
  authorize("system_admin", "administrator"),
  async (req, res) => {

  try {

    const [results] = await db.query(`
      SELECT
        id,
        username,
        role,
        operatingUnit,
      focalship
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

router.post(
  "/",
  authenticateToken,
  authorize("system_admin", "administrator"),
  async (req, res) => {
    try {
      const {
        username,
        password,
        role,
        operatingUnit,
        focalship
      } = req.body;

// Administrator can only create Users
if (
    req.user.role === "administrator" &&
    role !== "user"
) {
    return res.status(403).json({
        success: false,
        message: "Administrators can only create User accounts."
    });
}

let assignedOperatingUnit = operatingUnit;

// Administrator cannot choose another operating unit
if (req.user.role === "administrator") {
    assignedOperatingUnit = req.user.operatingUnit;
}
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        `INSERT INTO users
        (username, password, role, OperatingUnit, focalship)
        VALUES (?, ?, ?, ?, ?)`,
        [
          username,
          hashedPassword,
          role,
          assignedOperatingUnit,
          focalship || null
        ]
      );

      res.json({
        success: true,
        id: result.insertId
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        success: false,
        message: "Unable to create user."
      });

    }
  }
);

/* ================= UPDATE USER ================= */

router.put(
  "/:id",
  authenticateToken,
  authorize("system_admin"),
  async (req, res) => {
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

router.delete(
  "/:id",
  authenticateToken,
  authorize("system_admin"),
  async (req, res) => {
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
  `SELECT
      id,
      username,
      password,
      role,
      operatingUnit,
      focalship
   FROM users
   WHERE username = ?`,
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
  role: user.role,
  operatingUnit: user.operatingUnit,
  focalship: user.focalship
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
  operatingUnit: user.operatingUnit,
  focalship: user.focalship,
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