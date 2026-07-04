const File = require("../models/File");
const fs = require("fs");
const path = require("path");

// Upload File
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newFile = new File({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await newFile.save();

    res.status(201).json({
      message: "File uploaded successfully",
      file: newFile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Files
const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download File — forces browser to download with Content-Disposition: attachment
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", file.fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Physical file not found on disk" });
    }

    // Force download — attachment disposition
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Preview File — serves file inline for browser rendering (no download)
const previewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", file.fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Physical file not found on disk" });
    }

    // Serve inline — browser renders it, does NOT trigger a download
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.setHeader("Content-Type", file.fileType);
    res.setHeader("Cache-Control", "public, max-age=3600");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete File (soft delete → Trash)
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isDeleted = true;
    file.deletedAt = new Date();
    await file.save();

    res.json({ message: "File moved to Trash" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Restore File
const restoreFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isDeleted = false;
    file.deletedAt = null;
    await file.save();

    res.json({ message: "File restored successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Forever (hard delete)
const deleteForever = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "../uploads", file.fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File permanently deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Toggle Star
const toggleStar = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.isStarred = !file.isStarred;
    await file.save();

    res.json({ message: "Star updated", file });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  downloadFile,
  deleteFile,
  previewFile,
  toggleStar,
  restoreFile,
  deleteForever,
};