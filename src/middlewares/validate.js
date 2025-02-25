import createHttpError from 'http-errors';

/**
 * Middleware для валидации тела запроса
 */
export const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return next(createHttpError(400, error.details.map((err) => err.message).join(', ')));
  }

  req.body = value;
  next();
};
