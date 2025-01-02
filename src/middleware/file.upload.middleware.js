// file.upload.middleware.js
import multer from "multer";
import path from "path";
import fs from 'fs';
import handleError from "../utils/error_handler.js";
import authMiddleware from "./authMiddleware.js";
// Set up the upload directory
const uploadDir = './public/uploads/';  // Make sure this path is correct

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the directory where the files should be uploaded
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and the original name
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Set up the multer middleware with file filter and storage configuration
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /mp3|mpeg/; // Allowed file extensions
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    // If the file type matches, allow it
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only music files are allowed!'));
    
    }
  }
});

const artistUploadMiddleware = [authMiddleware,(req,res,next)=>{
 if(req.user.type !== 'artist')
 {
  return handleError(res, 403, "Only artists can upload music files.");
 }
 next();
}];

// Export the `upload` middleware to be used in the route
export { upload , artistUploadMiddleware };
