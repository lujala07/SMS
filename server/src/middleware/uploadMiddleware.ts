import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory =
    path.resolve(
        'uploads',
        'submissions'
    );

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true
        }
    );
}

const storage = multer.diskStorage({
    destination: (
        _req,
        _file,
        callback
    ) => {
        callback(
            null,
            uploadDirectory
        );
    },

    filename: (
        _req,
        file,
        callback
    ) => {
        const extension =
            path.extname(
                file.originalname
            );

        const baseName =
            path
                .basename(
                    file.originalname,
                    extension
                )
                .replace(
                    /[^a-zA-Z0-9_-]/g,
                    '_'
                );

        const uniqueName =
            `${Date.now()}-${baseName}${extension}`;

        callback(
            null,
            uniqueName
        );
    }
});

const fileFilter: multer.Options['fileFilter'] =
    (
        _req,
        file,
        callback
    ) => {
        const allowedTypes = [
            'application/pdf'
        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {
            callback(
                null,
                true
            );
        } else {
            callback(
                new Error(
                    'Only PDF files are allowed'
                )
            );
        }
    };

const upload = multer({
    storage,

    fileFilter,

    limits: {
        fileSize:
            10 * 1024 * 1024
    }
});

export default upload;
