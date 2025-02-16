import mongoose from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }
  next();
};
