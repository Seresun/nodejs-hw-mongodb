import path from 'path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const SORT_FIELDS = [
  '_id',
  'name',
  'email',
  'phone',
  'createdAt',
  'updatedAt',
];

export const CLOUDINARY = {
  CLOUD_NAME: 'doiz2mso3',
  API_KEY: '847883415548178',
  API_SECRET: 'c2T3wnV7AeCmvAwT9fZNWvLKZbI',
};

export const JWT = {
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const UPLOAD_DIR = path.join(process.cwd(), 'src', 'uploads');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'src', 'temp');
