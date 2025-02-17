import express from 'express';
import {
  getContactsController,
  createContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { contactJoiSchema } from '../db/models/contacts.js';

const router = express.Router();

router.get('/', getContactsController);
router.post('/', validateBody(contactJoiSchema), createContactController);
router.patch(
  '/:id',
  isValidId,
  validateBody(contactJoiSchema),
  updateContactController
);

export default router;
