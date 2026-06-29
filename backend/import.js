const fs = require("fs");
const db = require("./db");

// Path to your backup file
const backupFile = "D:/dashboard backup/tesda_opcr_full_backup.json";

// Read JSON backup
const backup = JSON.parse(fs.readFileSync(backupFile, "utf8"));

const opcrData = backup.opcrData || [];

console.log(`Found ${opcrData.length} KPI records...`);

let imported = 0;

opcrData.forEach((record) => {
  const sql = `
    INSERT INTO opcr_records
    (
      year,
      timeline,
      operatingUnit,
      pap,
      kpi,
      target,
      accomplishment,
      focalPerson,
      localStorageId
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      record.year,
      record.timeline,
      record.operatingUnit,
      record.pap,
      record.kpi,
      record.target,
      record.accomplishment,
      record.focalPerson,
      record.id
    ],
    (err) => {
      if (err) {
        console.error("Import Error:", err);
        return;
      }

      imported++;

      if (imported === opcrData.length) {
        console.log(`✅ Imported ${imported} KPI records`);
        process.exit();
      }
    }
  );
});