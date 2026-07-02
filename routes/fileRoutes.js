const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  previewFile,
  toggleStar,
  restoreFile,
  deleteForever,
} = require("../controllers/fileController");

// Upload file
router.post("/upload", upload.single("file"), uploadFile);

// Get all files
router.get("/", getFiles);

router.get("/preview/:id", previewFile);

// Download file
router.get("/download/:id", downloadFile);

router.patch("/star/:id", toggleStar);

// Delete file
router.delete("/:id", deleteFile);

router.patch("/restore/:id", restoreFile);

router.delete("/forever/:id", deleteForever);

module.exports = router;