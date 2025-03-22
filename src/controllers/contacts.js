import mongoose from 'mongoose';
import { ContactsCollection } from '../db/models/contacts.js';

import {
  createContact,
  deleteContact,
  getAllcontacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllcontacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw createHttpError(400, 'Invalid contact ID');
  }

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res, next) => {
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl = null;

  if (photo) {
    try {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      return next(createHttpError(500, 'Error uploading photo'));
    }
  }

  const contact = await createContact({
    ...req.body,
    userId,
    photo: photoUrl,
  });

  if (!contact) {
    return next(createHttpError(400, 'Failed to create contact'));
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).send();
};

export const upsetrtContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const result = await updateContact(contactId, req.body, { userId });

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully updated contact!',
    data: result,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const photo = req.file;
  let photoUrl = null;

  if (photo) {
    try {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      return next(createHttpError(500, 'Error uploading photo'));
    }
  }

  const existingContact = await ContactsCollection.findOne({
    _id: contactId,
    userId,
  });

  if (!existingContact) {
    return next(createHttpError(404, 'Contact not found or access denied'));
  }

  const updatedContact = await updateContact(
    contactId,
    { ...req.body, photo: photoUrl },
    { userId },
  );

  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: updatedContact,
  });
};
