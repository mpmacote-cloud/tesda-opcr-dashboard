const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================
// GET ALL OPERATING UNITS
// ==========================
router.get("/operating-units", async (req, res) => {
    try {

       const [rows] = await db.query(`
    SELECT
        id,
        code,
        name,
        status
    FROM operating_units
    ORDER BY name
`);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to load operating units."
        });

    }
});

// ==========================
// GET ALL FOCALSHIPS
// ==========================
router.get("/focalships", async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT
                f.id,
                f.code,
                f.name,
                o.id AS operatingUnitId,
                o.name AS operatingUnit
            FROM focalships f
            INNER JOIN operating_units o
                ON f.operatingUnitId = o.id
            WHERE
                f.status = 'ACTIVE'
                AND o.status = 'ACTIVE'
            ORDER BY
                o.name,
                f.name
        `);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to load focalships."
        });

    }
});
module.exports = router;