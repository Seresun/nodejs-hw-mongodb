// src/utils/saveFileToCloudinary.js

import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnv as getEnvVar } from '../utils/getEnv.js';

// Загружаем переменные среды явно
const cloudName = getEnvVar('CLOUDINARY_CLOUD_NAME');
const apiKey = getEnvVar('CLOUDINARY_API_KEY');
const apiSecret = getEnvVar('CLOUDINARY_API_SECRET');

cloudinary.v2.config({
  secure: true,
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
