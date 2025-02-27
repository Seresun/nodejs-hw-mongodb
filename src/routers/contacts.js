import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../validation/contactValidation.js';
import { upload } from '../services/cloudinaryService.js';

const router = Router();

// Все маршруты защищены авторизацией
router.use(authenticate);

// Получение контактов
router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));

// Создание контакта с возможностью загрузки фото
router.post(
  '/',
  upload.single('photo'),
  validateBody(contactCreateSchema),
  ctrlWrapper(createContactController)
);

// Обновление контакта с возможностью загрузки нового фото
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController)
);

// Удаление контакта
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));

export default router;
