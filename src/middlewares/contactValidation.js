import Joi from 'joi';

export const contactJoiSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(15).required(),
  favorite: Joi.boolean()
});