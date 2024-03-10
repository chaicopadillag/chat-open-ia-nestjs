import {
  FileTypeValidator,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const createMulterOptions: MulterModuleOptions = {
  storage: diskStorage({
    destination: './generated/uploads',
    filename: (req, file, callback) => {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${new Date().getTime()}.${fileExtension}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = new FileTypeValidator({
      fileType: 'audio/*',
    }).isValid(file);

    if (isValid) {
      callback(null, true);
    } else {
      callback(new UnprocessableEntityException('Invalid file type'), false);
    }
  },
};
