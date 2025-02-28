import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import {
  createContact,
  getContactById,
  getContacts,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../validation/contactValidation.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnv.js';

/**
 * Получение контактов текущего пользователя
 */
export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);

    const contactsData = await getContacts({
      userId: req.user.id,
      page,
      perPage,
      sortBy,
      sortOrder,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contactsData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Получение одного контакта по ID
 */
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    const contact = await getContactById(contactId, req.user.id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Создание нового контакта (с возможностью загрузки фото)
 */
export const createContactController = async (req, res, next) => {
  try {
    const { error, value } = contactCreateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw createHttpError(
        400,
        error.details.map((err) => err.message).join(', ')
      );
    }

    let photoUrl = null;
    if (req.file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(req.file);
      } else {
        photoUrl = req.file.path;
      }
    }

    const contact = await createContact({
      ...value,
      userId: req.user.id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление контакта
 */
export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    const contact = await deleteContact(contactId, req.user.id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление контакта (с возможностью загрузки нового фото)
 */
export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      throw createHttpError(400, 'Invalid contact ID');
    }

    const { error, value } = contactUpdateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw createHttpError(
        400,
        error.details.map((err) => err.message).join(', ')
      );
    }

    let photoUrl;
    if (req.file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(req.file);
      } else {
        photoUrl = req.file.path;
      }
    }

    const updatedData = {
      ...value,
      ...(photoUrl && { photo: photoUrl }),
    };

    const result = await updateContact(contactId, updatedData, req.user.id);

    if (!result) {
      throw createHttpError(404, 'Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
