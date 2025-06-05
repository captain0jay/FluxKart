import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string().email().allow(null).optional(),
  phoneNumber: Joi.number().allow(null).optional()
}).or('email', 'phoneNumber');
