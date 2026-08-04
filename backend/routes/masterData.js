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

router.get("/focalships", async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT

                f.id,
                f.shortName,
                f.fullName,
                f.status,

                GROUP_CONCAT(
                    ou.id
                    ORDER BY ou.name
                ) AS operatingUnitIds,

                GROUP_CONCAT(
                    ou.name
                    ORDER BY ou.name
                ) AS operatingUnitNames

            FROM focalships f

            LEFT JOIN focalship_operating_units fou
                ON fou.focalshipId = f.id

            LEFT JOIN operating_units ou
                ON ou.id = fou.operatingUnitId

            GROUP BY
                f.id,
                f.shortName,
                f.fullName,
                f.status

            ORDER BY f.fullName
        `);

        const formatted = rows.map(row => ({

    ...row,

    operatingUnitIds:
        row.operatingUnitIds
            ? row.operatingUnitIds
                  .split(",")
                  .map(Number)
            : [],

    operatingUnitNames:
        row.operatingUnitNames
            ? row.operatingUnitNames.split(",")
            : []

}));

res.json(formatted);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to load focalships."
        });

    }
});

// ======================================================
// ADD FOCALSHIP
// ======================================================

router.post("/focalships", async (req, res) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

       // =========================================
// READ REQUEST
// =========================================

const {

    shortName,

    fullName,

    operatingUnitIds,

    status

} = req.body;
// =========================================
// VALIDATION
// =========================================

if (

    !shortName ||

    !fullName ||

    !Array.isArray(operatingUnitIds) ||

    operatingUnitIds.length === 0

) {

    return res.status(400).json({

        success: false,

        message:
            "Short Name, Full Name and at least one Operating Unit are required."

    });

}

// =========================================
// CHECK DUPLICATES
// =========================================

const [existing] = await connection.query(
    `
    SELECT id
    FROM focalships
    WHERE shortName = ?
       OR fullName = ?
    `,
    [
        shortName.trim(),
        fullName.trim()
    ]
);

if (existing.length > 0) {

    return res.json({

        success: false,

        message:
            "Focalship already exists."

    });

}

// =========================================
// INSERT FOCALSHIP
// =========================================

const [result] = await connection.query(
    `
    INSERT INTO focalships
    (
        shortName,
        fullName,
        status
    )
    VALUES (?, ?, ?)
    `,
    [
        shortName.trim(),
        fullName.trim(),
        status || "ACTIVE"
    ]
);

const focalshipId = result.insertId;

// =========================================
// INSERT OPERATING UNIT ASSIGNMENTS
// =========================================

for (const operatingUnitId of operatingUnitIds) {

    await connection.query(
        `
        INSERT INTO focalship_operating_units
        (
            focalshipId,
            operatingUnitId
        )
        VALUES (?, ?)
        `,
        [
            focalshipId,
            operatingUnitId
        ]
    );

}

        await connection.commit();

        res.json({
            success: true,
            message: "Focalship added successfully."
        });

    } catch (err) {

        await connection.rollback();

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to add focalship."
        });

    } finally {

        connection.release();

    }

});


router.post("/operating-units", async (req, res) => {
    try {

        const { code, name, status } = req.body;

        if (!code || !name) {
            return res.status(400).json({
                success: false,
                message: "Code and Operating Unit are required."
            });
        }

        // =========================================
        // CHECK FOR DUPLICATE CODE OR NAME
        // =========================================

        const [existing] = await db.query(
            `
            SELECT id
            FROM operating_units
            WHERE code = ?
               OR name = ?
            `,
            [code.trim(), name.trim()]
        );

        if (existing.length > 0) {
            return res.json({
                success: false,
                message: "Operating Unit already exists."
            });
        }


        // =========================================
        // INSERT NEW OPERATING UNIT
        // =========================================

        await db.query(
            `
            INSERT INTO operating_units
            (
                code,
                name,
                status
            )
            VALUES (?, ?, ?)
            `,
            [
                code.trim(),
                name.trim(),
                status || "ACTIVE"
            ]
        );

        res.json({
            success: true,
            message: "Operating Unit added successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to add operating unit."
        });

    }
});

router.put("/operating-units/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const { code, name, status } = req.body;

        if (!code || !name) {
            return res.status(400).json({
                success: false,
                message: "Code and Operating Unit are required."
            });
        }

        // =========================================
        // CHECK FOR DUPLICATE CODE OR NAME
        // (excluding the current record)
        // =========================================

        const [existing] = await db.query(
            `
            SELECT id
            FROM operating_units
            WHERE (code = ? OR name = ?)
              AND id <> ?
            `,
            [
                code.trim(),
                name.trim(),
                id
            ]
        );

        if (existing.length > 0) {
            return res.json({
                success: false,
                message: "Another Operating Unit already uses this Code or Name."
            });
        }

        // =========================================
        // UPDATE
        // =========================================

        await db.query(
            `
            UPDATE operating_units
            SET
                code = ?,
                name = ?,
                status = ?
            WHERE id = ?
            `,
            [
                code.trim(),
                name.trim(),
                status,
                id
            ]
        );

        res.json({
            success: true,
            message: "Operating Unit updated successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to update Operating Unit."
        });

    }
});

router.patch("/operating-units/:id/status", async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        await db.query(
            `
            UPDATE operating_units
            SET status = ?
            WHERE id = ?
            `,
            [
                status,
                id
            ]
        );

        res.json({
            success: true,
            message: "Operating Unit status updated."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Unable to update status."
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