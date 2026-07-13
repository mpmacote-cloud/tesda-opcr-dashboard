require("dotenv").config();
console.log("======================================");
console.log(" TESDA Bukidnon OPCR API");
console.log(" Version 1.0.0");
console.log(" Developed by Mat Perater Macote");
console.log("======================================");

console.log("JWT Loaded:", !!process.env.JWT_SECRET);
const express = require("express");
const cors = require("cors");
const opcrRoutes = require("./routes/opcr");

const userRoutes = require("./routes/users");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tesda-opcr-dashboard.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

app.use("/api/opcr", opcrRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("TESDA OPCR API Running");
});

app.get("/hello", (req, res) => {
  res.send("Hello works");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});