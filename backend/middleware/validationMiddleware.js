// middleware/validationMiddleware.js
import { body, param, validationResult } from 'express-validator';

// Middleware de validation pour la suppression d'utilisateur
export const validateUserDeletion = [
  // Validation du paramètre userId
  param('userId')
    .trim()
    .notEmpty().withMessage('L\'ID utilisateur est requis')
    .isInt().withMessage('L\'ID utilisateur doit être un entier'),
  
  // Middleware de gestion des erreurs de validation
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Erreurs de validation', 
        errors: errors.array() 
      });
    }
    
    next();
  }
];

// Middleware de validation pour la mise à jour de rôle
export const validateRoleUpdate = [
  // Validation du paramètre userId
  param('userId')
    .trim()
    .notEmpty().withMessage('L\'ID utilisateur est requis')
    .isInt().withMessage('L\'ID utilisateur doit être un entier'),
  
  // Validation du nouveau rôle
  body('newRole')
    .trim()
    .notEmpty().withMessage('Le nouveau rôle est requis')
    .isIn(['user', 'moderator', 'admin']).withMessage('Rôle non valide'),
  
  // Middleware de gestion des erreurs de validation
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Erreurs de validation', 
        errors: errors.array() 
      });
    }
    
    next();
  }
];