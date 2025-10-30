import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

export const PlanUploadOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Generate a unique temp folder per request
      if (!req.tempUploadId) {
        req.tempUploadId = uuidv4(); // Attach to request object
      }

      const tempDir = path.join(__dirname, '..', '..', 'public', 'plans', 'tmp', req.tempUploadId);

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = file.mimetype.split('/')[1];
      cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const validMimeTypePattern = /image\/png|image\/jpeg|image\/jpg|imagesvg\+xml|image\/gif|image\/svg\+xml/;
    if (!validMimeTypePattern.test(file.mimetype)) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    cb(null, true);
  },
};
