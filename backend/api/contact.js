// api/contact.js - Si vous utilisez Express.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const crypto = require('crypto');

// Protection CSRF
const csrfProtection = csrf({ cookie: true });

// Limitation du taux de requêtes (rate limiting) globale
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5, // 5 demandes par fenêtre
  message: 'Trop de demandes de contact. Veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitation plus stricte après échecs de captcha
const captchaFailLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10, // 10 essais de captcha par IP
  message: 'Trop de tentatives de captcha incorrectes. Veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Utilise l'IP et l'identifiant de session pour la limitation
    return `${req.ip}-${req.sessionID}-captcha`;
  }
});

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
});

// Validation et sanitisation des entrées
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit comporter entre 2 et 100 caractères')
    .escape(),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Veuillez fournir une adresse email valide')
    .normalizeEmail(),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Le message doit comporter entre 10 et 1000 caractères')
    .customSanitizer(value => {
      // Sanitiser le HTML pour éviter les XSS
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {}
      });
    }),
  
  body('captcha')
    .notEmpty()
    .withMessage('Le captcha est requis')
];

// Endpoint de vérification du captcha
router.post(
  '/verify-captcha',
  captchaFailLimiter,
  csrfProtection,
  async (req, res) => {
    try {
      const { captcha } = req.body;
      
      // Vérification du captcha
      if (!req.session.captcha || captcha !== req.session.captcha) {
        // Incrémenter le compteur d'échecs
        req.session.captchaFailures = (req.session.captchaFailures || 0) + 1;
        
        // Vérifier si le nombre maximum d'échecs est atteint
        if (req.session.captchaFailures >= 5) {
          // Bloquer temporairement la session
          req.session.captchaBlocked = true;
          req.session.captchaBlockedUntil = new Date().getTime() + (15 * 60 * 1000); // 15 minutes
          
          return res.status(429).json({
            success: false,
            message: 'Trop de tentatives incorrectes. Veuillez réessayer dans 15 minutes.'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: 'Code captcha invalide',
          attemptsLeft: 5 - req.session.captchaFailures
        });
      }
      
      // Captcha correct - réinitialiser le compteur d'échecs
      req.session.captchaFailures = 0;
      
      // Générer un jeton temporaire pour la soumission du formulaire
      const formToken = crypto.randomBytes(32).toString('hex');
      req.session.formToken = formToken;
      req.session.formTokenExpires = new Date().getTime() + (5 * 60 * 1000); // 5 minutes
      
      return res.status(200).json({
        success: true,
        formToken: formToken
      });
    } catch (error) {
      console.error('Erreur lors de la vérification du captcha:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la vérification'
      });
    }
  }
);

// Endpoint de contact
router.post(
  '/contact',
  contactLimiter,
  csrfProtection,
  contactValidation,
  async (req, res) => {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Erreurs de validation',
          errors: errors.array()
        });
      }

      // Vérifier si l'utilisateur est bloqué
      if (req.session.captchaBlocked) {
        const currentTime = new Date().getTime();
        if (currentTime < req.session.captchaBlockedUntil) {
          return res.status(429).json({
            success: false,
            message: 'Trop de tentatives incorrectes. Veuillez réessayer plus tard.',
            blockedUntil: req.session.captchaBlockedUntil
          });
        } else {
          // Réinitialiser le blocage s'il a expiré
          req.session.captchaBlocked = false;
        }
      }
      
      // Vérification du jeton de formulaire
      const { formToken } = req.body;
      if (!req.session.formToken || formToken !== req.session.formToken) {
        return res.status(400).json({
          success: false,
          message: 'Session invalide ou expirée. Veuillez rafraîchir la page et réessayer.'
        });
      }
      
      // Vérifier si le jeton est expiré
      const currentTime = new Date().getTime();
      if (currentTime > req.session.formTokenExpires) {
        return res.status(400).json({
          success: false,
          message: 'Session expirée. Veuillez rafraîchir la page et réessayer.'
        });
      }

      // Préparation de l'email
      const mailOptions = {
        from: `"Formulaire de contact" <${process.env.MAIL_FROM}>`,
        to: process.env.MAIL_TO,
        replyTo: req.body.email,
        subject: `Nouveau message de ${req.body.name}`,
        text: `
Nom: ${req.body.name}
Email: ${req.body.email}

Message:
${req.body.message}
        `,
        html: `
<h2>Nouveau message de contact</h2>
<p><strong>Nom:</strong> ${req.body.name}</p>
<p><strong>Email:</strong> <a href="mailto:${req.body.email}">${req.body.email}</a></p>
<p><strong>Message:</strong></p>
<p>${req.body.message.replace(/\n/g, '<br>')}</p>
        `
      };

      // Envoi de l'email
      await transporter.sendMail(mailOptions);

      // Réinitialiser le captcha après une tentative réussie
      req.session.captcha = null;

      // Réponse au client
      res.status(200).json({
        success: true,
        message: 'Message envoyé avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi du message'
      });
    }
  }
);
