import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'contacts',
    format: async () => 'jpg',
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage });

// ✅ Экспортируем `upload` правильно для ES6
export { upload };
