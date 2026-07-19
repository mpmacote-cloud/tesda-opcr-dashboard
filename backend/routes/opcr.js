const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/auth");
const authorize = require("../middleware/authorize");

/* ================= GET ALL ================= */

router.get("/", authenticateToken, async (req, res) => {
  try {

    let sql = "";
    let params = [];

    // SYSTEM ADMINISTRATOR
    if (req.user.role === "system_admin") {

      sql = `
        SELECT *
        FROM opcr_records
        ORDER BY year DESC
      `;

    }

    // ADMINISTRATOR
    else if (req.user.role === "administrator") {

      sql = `
        SELECT *
        FROM opcr_records
        WHERE operatingUnit = ?
        ORDER BY year DESC
      `;

      params = [req.user.operatingUnit];

    }

    // USER
    else if (req.user.role === "user") {

      sql = `
        SELECT *
        FROM opcr_records
        WHERE operatingUnit = ?
        AND focalPerson = ?
        ORDER BY year DESC
      `;

      params = [
        req.user.operatingUnit,
        req.user.focalship
      ];

    }

    else {

      return res.status(403).json({
        success: false,
        message: "Unauthorized role."
      });

    }

    const [results] = await db.query(sql, params);

    res.json(results);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

/* ================= CREATE ================= */

/* ================= CREATE ================= */

router.post("/", authenticateToken, async (req, res) => {
  try {

    let {
      year,
      operatingUnit,
      pap,
      kpi,
      target,
      accomplishment,
      timeline,
      focalPerson
    } = req.body;

    // USER cannot create KPI
    if (req.user.role === "user") {
      return res.status(403).json({
        success: false,
        message: "Users are not allowed to create KPI records."
      });
    }

    // ADMINISTRATOR can only create within their own Operating Unit
    if (req.user.role === "administrator") {
      operatingUnit = req.user.operatingUnit;
    }

    // SYSTEM ADMINISTRATOR can create anywhere
    if (req.user.role !== "system_admin" &&
        req.user.role !== "administrator") {

      return res.status(403).json({
        success: false,
        message: "Unauthorized."
      });
    }

    const [result] = await db.query(
      `INSERT INTO opcr_records
      (
        year,
        operatingUnit,
        pap,
        kpi,
        target,
        accomplishment,
        timeline,
        focalPerson
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        year,
        operatingUnit,
        pap,
        kpi,
        target,
        accomplishment,
        timeline,
        focalPerson
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
      message: err.message
    });

  }
});

/* ================= UPDATE ================= */

router.put(
  "/:id",
  authenticateToken,
  authorize("system_admin", "administrator"),
  async (req, res) => {
  try {

    const id = req.params.id;

  let {
  year,
  operatingUnit,
  pap,
  kpi,
  target,
  accomplishment,
  timeline,
  focalPerson
} = req.body;

// Administrators cannot change Operating Unit.
if (req.user.role === "administrator") {
  operatingUnit = req.user.operatingUnit;
}

    await db.query(
      `UPDATE opcr_records
      SET
        year=?,
        operatingUnit=?,
        pap=?,
        kpi=?,
        target=?,
        accomplishment=?,
        timeline=?,
        focalPerson=?
      WHERE id=?`,
      [
        year,
        operatingUnit,
        pap,
        kpi,
        target,
        accomplishment,
        timeline,
        focalPerson,
        id
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

/* ================= DELETE ================= */

router.delete(
  "/:id",
  authenticateToken,
  authorize("system_admin"),
  async (req, res) => {
  try {

    await db.query(
      "DELETE FROM opcr_records WHERE id=?",
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

module.exports = router;