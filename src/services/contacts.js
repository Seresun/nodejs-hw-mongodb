// src/services/contacts.js
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllcontacts = async ({
  userId,
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find({ userId }); // Фільтр по userId
  const contactsCount = await ContactsCollection.countDocuments({ userId });

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const deleteContact = async (contactId, userId) => {
  return await ContactsCollection.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (contactId, payload, options = {}) => {
  if (!options.userId) {
    throw new Error('userId is required for updating contact');
  }

  const sanitizedPayload = JSON.parse(JSON.stringify(payload));

  const updatedContact = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId: options.userId },
    { $set: sanitizedPayload },
    { new: true },
  );

  if (!updatedContact) {
    throw new Error('Contact not found or update failed');
  }

  return updatedContact;
};
