import { MulterAzureStorage } from 'multer-azure-blob-storage';
import { Request } from 'express';
import { RoutineUser } from '../types/RoutineUser';
import * as path from 'path';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

const generateBlobName = async (req: Request, file: Express.Multer.File) => {
  const user = req['user'] as RoutineUser;
  if (!user) {
    throw new ForbiddenException();
  }

  if (!['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
    throw new BadRequestException();
  }

  return `${user.id}/${Date.now()}${path.extname(file.originalname)}`;
};

const profileImageAzureStorage = new MulterAzureStorage({
  connectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  containerName: 'profileimages',
  blobName: generateBlobName,
  urlExpirationTime: -1,
});

export default profileImageAzureStorage;
