const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Multer configuration for evidence file uploads
 * Stores files temporarily in uploads/ directory
 */

// Allowed MIME types
const allowedMimeTypes = [
  'application/pdf',                    // PDF
  'image/png', 'image/jpeg', 'image/jpg',  // Images
  'text/csv',                          // CSV
  'application/json',                  // JSON
  'text/plain'                         // TXT, LOG
];

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/evidence';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to prevent conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

/**
 * File filter - validates MIME types
 * Rejects files that don't match allowed types
 */
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file type.'));
  }
};

/**
 * Multer upload middleware configuration
 * - Max file size: 25 MB
 * - Allowed types: PDF, images, CSV, JSON, TXT, LOG
 * - Storage: uploads/evidence directory
 */
const uploadEvidence = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max
  },
  fileFilter: fileFilter
});

/**
 * Error handler for multer errors
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'ERROR',
        message: 'File bigger than 25 MB.'
      });
    }
    return res.status(400).json({
      status: 'ERROR',
      message: err.message || 'File upload failed.'
    });
  }
  if (err) {
    // Handle file filter errors (unsupported file types)
    if (err.message && err.message.includes('Unsupported file type')) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Unsupported file type.'
      });
    }
    return res.status(400).json({
      status: 'ERROR',
      message: err.message || 'File upload failed.'
    });
  }
  next();
};

module.exports = {
  uploadEvidence,
  handleMulterError,
  allowedMimeTypes
};

