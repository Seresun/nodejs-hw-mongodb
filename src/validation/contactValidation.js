import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required(),
  contactType: Joi.string().valid('personal', 'business', 'other').required(),
  isFavourite: Joi.boolean().optional(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/),
  contactType: Joi.string().valid('personal', 'business', 'other'),
  isFavourite: Joi.boolean(),
}).min(1);
