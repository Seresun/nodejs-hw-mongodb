import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\+\d{12}$/, 'Phone number must be in the format +380000000000'],
    },
    email: { type: String, match: [/^\S+@\S+\.\S+$/, 'Invalid email format'] },
    isFavourite: { type: Boolean, required: true, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  },
  { timestamps: true }
);

const ContactCollection = model('Contact', contactSchema);
export default ContactCollection;
