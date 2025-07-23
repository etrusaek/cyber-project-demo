const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `photo-${Date.now()}.jpg`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.post("/upload-photo", upload.single("photo"), (req, res) => {
  res.json({ status: "Photo uploaded", file: req.file.filename });
});

app.post("/report", (req, res) => {
  const data = req.body;
  const logPath = path.join(__dirname, "report.json");
  let existing = [];

  if (fs.existsSync(logPath)) {
    existing = JSON.parse(fs.readFileSync(logPath));
  }

  existing.push({ timestamp: new Date(), ...data });
  fs.writeFileSync(logPath, JSON.stringify(existing, null, 2));
  res.json({ status: "Data received" });
});

app.get("/logs", (req, res) => {
  const logPath = path.join(__dirname, "report.json");
  if (fs.existsSync(logPath)) {
    const logs = JSON.parse(fs.readFileSync(logPath));
    res.json(logs);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
