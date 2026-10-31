import multer from 'multer';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectUploadDir = path.resolve(__dirname, '../public/uploads');
const fallbackUploadDir = path.join(os.tmpdir(), 'career-guidance-uploads');

function resolveUploadDir() {
    const candidates = [projectUploadDir, fallbackUploadDir];

    for (const candidate of candidates) {
        try {
            fs.mkdirSync(candidate, { recursive: true });
            fs.accessSync(candidate, fs.constants.W_OK);
            return candidate;
        } catch (error) {
            // Keep trying the next candidate.
        }
    }

    return fallbackUploadDir;
}

export const UPLOAD_DIR = resolveUploadDir();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const mime = file.mimetype || '';
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(mime)) {
            return cb(null, true);
        }

        const extension = path.extname(file.originalname || '').toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(extension)) {
            return cb(null, true);
        }

        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
});