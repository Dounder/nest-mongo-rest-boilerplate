import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  PORT: Joi.number().default(3000),
  STATE: Joi.string().default('dev'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().default('4h'),
});
