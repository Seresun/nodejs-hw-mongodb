import ContactCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const order = sortOrder === 'desc' ? -1 : 1;

  const validSortFields = ['name', 'email', 'phone', 'contactType'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';

  const contactsQuery = ContactCollection.find().sort({ [sortField]: order });
  const contactsCount = await ContactCollection.countDocuments();

  const contacts = await contactsQuery.skip(skip).limit(limit).exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  return ContactCollection.findById(contactId);
};

export const createContact = async (payload) => {
  return ContactCollection.create(payload);
};

export const deleteContact = async (contactId) => {
  return ContactCollection.findOneAndDelete({ _id: contactId });
};

export const updateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await ContactCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      ...options,
    }
  );

  return updatedContact;
};
