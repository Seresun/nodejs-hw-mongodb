import createHttpError from 'http-errors';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../db/services/contacts.js';
import { contactJoiSchema } from '../middlewares/contactValidation.js';

export const getContactsController = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;
    const contacts = await getContacts(page, perPage, sortBy, sortOrder);
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) return next(createHttpError(404, 'Contact not found'));
    res.json({ status: 200, data: contact });
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const { error } = contactJoiSchema.validate(req.body);
    if (error) return next(createHttpError(400, error.message));
    const contact = await createContact(req.body);
    res
      .status(201)
      .json({
        status: 201,
        message: 'Successfully created contact!',
        data: contact,
      });
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { error } = contactJoiSchema.validate(req.body);
    if (error) return next(createHttpError(400, error.message));
    const contact = await updateContact(req.params.id, req.body);
    if (!contact) return next(createHttpError(404, 'Contact not found'));
    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const contact = await deleteContact(req.params.id);
    if (!contact) return next(createHttpError(404, 'Contact not found'));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
