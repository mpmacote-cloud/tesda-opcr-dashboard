const fs = require("fs");
const db = require("./db");

const backupFile = "D:/dashboard backup/tesda_opcr_full_backup.json";

const backup = JSON.parse(
  fs.readFileSync(backupFile, "utf8")
);

const users = backup.users || [];

console.log(`Found ${users.length} users...`);

let imported = 0;

users
  .filter(
    user =>
      user.username &&
      user.username.trim() !== ""
  )
  .forEach(user => {

    const sql = `
      INSERT INTO users
      (username, password, role)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [
        user.username,
        user.password,
        user.role
      ],
      err => {

        if (err) {
          console.error(err);
          return;
        }

        imported++;

        console.log(
          `Imported: ${user.username}`
        );
      }
    );
  });

setTimeout(() => {
  console.log(
    `✅ Imported ${imported} users`
  );
  process.exit();
}, 2000);