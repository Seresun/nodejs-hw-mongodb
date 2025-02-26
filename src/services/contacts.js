import ContactCollection from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContacts = async ({ userId, page, perPage, sortBy, sortOrder }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const { sortBy: validSortBy, sortOrder: validSortOrder } = parseSortParams({
    sortBy,
    sortOrder,
  });
  const order = validSortOrder === 'desc' ? -1 : 1;

  // Фильтруем только контакты, принадлежащие текущему пользователю
  const contactsQuery = ContactCollection.find({ userId }).sort({ [validSortBy]: order });
  const contactsCount = await ContactCollection.countDocuments({ userId });

  const contacts = await contactsQuery.skip(skip).limit(limit).exec();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  return ContactCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
  return ContactCollection.create(payload);
};

export const deleteContact = async (contactId, userId) => {
  return ContactCollection.findOneAndDelete({ _id: contactId, userId });
};

export const updateContact = async (contactId, payload, userId, options = {}) => {
  return ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },  // Ищем по id и userId
    payload,
    {
      new: true,
      ...options,
    }
  );
};
