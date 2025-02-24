import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
// Додаємо метод objectId до Joi
Joi.objectId = JoiObjectId(Joi);
export const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Name is required',
    'string.base': 'Username should be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be at most 20 characters long',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{12}$/) // Формат +380000000000
    .required()
    .messages({
      'any.required': 'Phone number is required',
      'string.empty': 'Phone number cannot be empty',
      'string.pattern.base': 'Phone number must be in the format +380000000000',
    }),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().required().messages({
    'any.required': 'isFavourite is required',
  }),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'Contact type is required',
      'any.only': 'Contact type must be one of [work, home, personal]',
    }),
  userId: Joi.objectId().optional().messages({
    'string.pattern.base': 'Parent ID must be a valid ObjectId',
  }),
});
export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .pattern(/^\+\d{12}$/) // Формат +380000000000
    .messages({
      'string.pattern.base': 'Phone number must be in the format +380000000000',
    }),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be one of [work, home, personal]',
  }),
  userId: Joi.objectId().optional().messages({
    'string.pattern.base': 'Parent ID must be a valid ObjectId',
  }),
});