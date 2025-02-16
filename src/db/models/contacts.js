import Joi from 'joi';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    favorite: { type: Boolean, default: false },
  },
  { versionKey: false }
);

contactSchema.plugin(mongoosePaginate);

export const ContactCollection = mongoose.model('Contact', contactSchema);

export const contactJoiSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(15).required(),
  favorite: Joi.boolean(),
});
