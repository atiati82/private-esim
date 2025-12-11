import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

import type { AccountCreateFormData } from '@/data-store/auth-api';

export const emailFieldSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .trim()
  .messages({
    'string.empty': 'Valid e-mail is required.',
    'string.email': 'E-mail must be a valid e-mail address.',
  });

export const passwordFieldSchema = passwordComplexity(
  {
    min: 9,
    max: 128,
    lowerCase: 2,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 5,
  },
  'Password',
)
  .required()
  .messages({
    'string.empty': 'Password is required.',
    'passwordComplexity.requirementCount':
      'Password is a bit too simple. Try something more complex.',
  });

export const passwordConfirmFieldSchema = Joi.any().equal(Joi.ref('password')).required().messages({
  'any.only': 'Passwords do not match.',
  'string.empty': 'Password confirmation is required.',
});

export const tcsFieldSchema = Joi.boolean().required().valid(true).messages({
  'any.only': 'You must agree to Terms and Conditions.',
  'any.required': 'You must agree to Terms and Conditions.',
  'boolean.base': 'You must agree to Terms and Conditions.',
});

/**
 * @see AccountCreateFormData
 */
export const accountCreateSchema = Joi.object<AccountCreateFormData>({
  email: emailFieldSchema,
  password: passwordFieldSchema,
  passwordConfirm: passwordConfirmFieldSchema,
  legalAgreement: tcsFieldSchema,
});
