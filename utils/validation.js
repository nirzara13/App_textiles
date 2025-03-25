import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 }).withMessage('Mot de passe trop court')
    .matches(/\d/).withMessage('Doit contenir un chiffre')
];

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};