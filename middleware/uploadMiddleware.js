import multer from 'multer';
import { extname } from 'node:path';

const DOCX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const extension = extname(file.originalname).toLowerCase();
        const isPdf = extension === '.pdf' && file.mimetype === 'application/pdf';
        const isDocx = extension === '.docx' && file.mimetype === DOCX_MIME_TYPE;

        if (isPdf || isDocx) {
            return cb(null, true);
        }

        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
    }
});

export default upload;
