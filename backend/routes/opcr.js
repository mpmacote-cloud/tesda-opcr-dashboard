const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/auth");
const requireAdmin = require("../middleware/admin");

/* ================= GET ALL ================= */

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM opcr_records ORDER BY year DESC"
    );

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

/* ================= CREATE ================= */

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {

    const {
      year,
      operatingUnit,
      pap,
      kpi,
      target,
      accomplishment,
      timeline,
      focalPerson
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO opcr_records
      (year, operatingUnit, pap, kpi, target, accomplishment, timeline, focalPerson)
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
    res.status(500).json(err);
  }
});

/* ================= UPDATE ================= */

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {

    const id = req.params.id;

    const {
      year,
      operatingUnit,
      pap,
      kpi,
      target,
      accomplishment,
      timeline,
      focalPerson
    } = req.body;

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

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
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