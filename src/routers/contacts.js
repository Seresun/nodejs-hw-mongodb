import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validate.js'; // ✅ Исправленный импорт
import { authenticate } from '../middlewares/authenticate.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../validation/contactValidation.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.use(authenticate); // Все маршруты теперь защищены

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post('/', validateBody(contactCreateSchema), ctrlWrapper(createContactController)); // ✅ Исправлено
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContactController)); // ✅ Исправлено

export default router;
