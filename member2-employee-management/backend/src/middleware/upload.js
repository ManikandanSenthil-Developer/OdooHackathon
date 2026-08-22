const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/documents';
    if (file.fieldname === 'profile_picture') {
      folder = 'uploads/profiles';
    }
    
    // Ensure folder exists
    const destPath = path.join(process.cwd(), folder);
    fs.mkdirSync(destPath, { recursive: true });
    
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const employeeId = req.params.employeeId || 'unknown';
    const uniqueSuffix = crypto.randomBytes(6).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${employeeId}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profile_picture') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid profile picture format. Only JPEG, PNG and WEBP are allowed.'), false);
    }
  } else if (file.fieldname === 'document') {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid document format.'), false);
    }
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter
});

module.exports = upload;
