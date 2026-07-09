require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function migrateAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const username = "admin";
    const newPassword = "tesdabukidnon@32";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await connection.execute(
      "UPDATE users SET password=? WHERE username=?",
      [hashedPassword, username]
    );

    console.log("==================================");
    console.log("✅ Admin password updated.");
    console.log("Username:", username);
    console.log("Password:", newPassword);
    console.log("==================================");

    await connection.end();

  } catch (err) {
    console.error(err);
  }
}

migrateAdmin();