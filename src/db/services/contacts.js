import { ContactCollection } from '../models/contacts.js';

export const getContacts = async (page, limit, sortBy, order, filter = {}) => {
  const options = {
    page,
    limit,
    sort: { [sortBy]: order === 'asc' ? 1 : -1 },
  };
  return await ContactCollection.paginate(filter, options);
};

export const createContact = async (payload) => {
  return await ContactCollection.create(payload);
};

export const updateContact = async (contactId, payload) => {
  return await ContactCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};
