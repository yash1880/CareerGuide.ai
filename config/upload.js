import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = 'public/uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // File name ke saare spaces ko underscore (_) mein convert kar dega
        const cleanName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${cleanName}`);
    }
});

export const upload = multer({ 
    storage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});