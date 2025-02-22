import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true },
    phone: { type: String, required: true, minlength: 7, maxlength: 15 },
    contactType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
    },
    favorite: { type: Boolean, default: false },
  },
  { versionKey: false }
);

contactSchema.plugin(mongoosePaginate);

export const ContactCollection = mongoose.model('Contact', contactSchema);
