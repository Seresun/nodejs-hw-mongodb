import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?\d{7,15}$/)
    .required(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
  favorite: Joi.boolean().optional(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^\+?\d{7,15}$/),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  favorite: Joi.boolean(),
}).min(1);
