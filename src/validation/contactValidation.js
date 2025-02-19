import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
  contactType: Joi.string().valid("personal", "business").required(),
  isFavourite: Joi.boolean().optional(),
});
