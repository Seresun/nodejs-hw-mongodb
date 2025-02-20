import { Router } from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import validate from '../middlewares/validate.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../validation/contactValidation.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController));
router.post(
  '/',
  validate(contactCreateSchema),
  ctrlWrapper(createContactController)
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.patch(
  '/:contactId',
  isValidId,
  validate(contactUpdateSchema),
  ctrlWrapper(patchContactController)
);

export default router;
