const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= GET ALL ================= */

router.get("/", (req, res) => {
  db.query(
    "SELECT * FROM opcr_records ORDER BY year DESC",
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
});

/* ================= CREATE ================= */

router.post("/", (req, res) => {

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

  db.query(
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
    ],
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

/* ================= UPDATE ================= */

router.put("/:id", (req, res) => {

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

  db.query(
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

/* ================= DELETE ================= */

router.delete("/:id", (req, res) => {

  db.query(
    "DELETE FROM opcr_records WHERE id=?",
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

module.exports = router;