import multer from 'multer';
import path from 'node:path';

const imageMimeTypes = new Map([
    ['.jpg', 'image/jpeg'],
    ['.jpeg', 'image/jpeg'],
    ['.png', 'image/png'],
    ['.webp', 'image/webp'],
    ['.gif', 'image/gif']
]);

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname || '').toLowerCase();
        if (imageMimeTypes.get(extension) === file.mimetype) {
            return cb(null, true);
        }

        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
});
