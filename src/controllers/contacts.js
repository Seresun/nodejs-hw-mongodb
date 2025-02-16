import createHttpError from 'http-errors';
import Joi from 'joi';
import { contactJoiSchema } from '../db/models/contacts.js';
import { getContacts, createContact, updateContact } from '../db/services/contacts.js';

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  sortBy: Joi.string().valid('name', 'email', 'phone', 'favorite').default('name'),
  order: Joi.string().valid('asc', 'desc').default('asc'),
  favorite: Joi.boolean()
});

export const getContactsController = async (req, res, next) => {
  const { error, value } = paginationSchema.validate(req.query);
  if (error) return next(createHttpError(400, error.message));

  const filter = value.favorite !== undefined ? { favorite: value.favorite } : {};
  const contacts = await getContacts(value.page, value.limit, value.sortBy, value.order, filter);
  res.json({ status: 200, message: "Successfully found contacts!", data: contacts });
};

export const createContactController = async (req, res, next) => {
  const { error } = contactJoiSchema.validate(req.body);
  if (error) return next(createHttpError(400, error.message));
  const contact = await createContact(req.body);
  res.status(201).json({ status: 201, message: "Successfully created contact!", data: contact });
};

export const updateContactController = async (req, res, next) => {
  const { error } = contactJoiSchema.validate(req.body);
  if (error) return next(createHttpError(400, error.message));
  const contact = await updateContact(req.params.id, req.body);
  if (!contact) return next(createHttpError(404, 'Contact not found'));
  res.json({ status: 200, message: "Successfully updated contact!", data: contact });
};