import express from 'express';
import {upload} from '../middleware/file.upload.middleware.js';
import path from 'path';
import fs from 'fs';
import handleError from '../utils/error_handler.js';
import multer from 'multer';

const router = express.Router();

router.post('/upload',upload.single('music_file'),(req,res)=>
{
    if(!req.file)
    {
        return handleError(res,401,"There is no file selected");
    }
    res.status(200).json({
        message: 'File uploaded successfully!',
        file: req.file,
      });
}
);
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors, such as file size limits
    return handleError(res, 400, `Multer Error: ${err.message}`);
  }

  // Handle any other errors, such as custom file format errors
  if (err.message === 'Only music files are allowed!') {
    return handleError(res, 400, err.message);
  }

  // For any other unexpected errors, send a generic error message
  return handleError(res, 500, 'Something went wrong during file upload.');
});

export default router;