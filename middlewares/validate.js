import { z } from 'zod';
import AppError from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  try {
    // If schema is a Zod object/effect, we parse the request body
    // We can extend this to validate query/params if needed by
    // passing a schema that expects { body, query, params }
    // but for now let's keep it simple: validate req.body against schema
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      return next(new AppError(`Validation Error: ${messages.join(', ')}`, 400));
    }
    next(err);
  }
};

export default validate;
