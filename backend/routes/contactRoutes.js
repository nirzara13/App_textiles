// routes/contactRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';
import sanitizeHtml from 'sanitize-html';
import crypto from 'crypto';

const router = express.Router();

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
];

// Configuration du transporteur d'email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  });
};

// Endpoint pour générer et stocker un captcha
router.get('/captcha', (req, res) => {
  try {
    // Génère un captcha
    const generateCaptcha = () => {
      const upperChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
      const lowerChars = 'abcdefghjkmnpqrstuvwxyz';
      const numbers = '23456789';
      
      let result = '';
      result += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
      result += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
      
      const allChars = upperChars + lowerChars + numbers;
      while (result.length < 6) {
        result += allChars.charAt(Math.floor(Math.random() * allChars.length));
      }
      
      // Mélanger les caractères
      return result.split('').sort(() => 0.5 - Math.random()).join('');
    };
    
    const captcha = generateCaptcha();
    
    // Stocke le captcha dans la session
    req.session.captcha = captcha;
    req.session.captchaGeneratedTime = new Date().getTime();
    
    res.status(200).json({
      success: true,
      message: 'Captcha généré avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la génération du captcha:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la génération du captcha'
    });
  }
});






// Route pour définir le captcha depuis le frontend
router.post('/set-captcha', async (req, res) => {
  try {
    const { captcha } = req.body;
    
    if (!captcha || typeof captcha !== 'string' || captcha.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Captcha invalide'
      });
    }
    
    // Stocke le captcha dans la session
    req.session.captcha = captcha;
    req.session.captchaGeneratedTime = new Date().getTime();
    
    // Log pour le débogage (à supprimer en production)
    console.log('Captcha défini en session:', captcha);
    
    return res.status(200).json({
      success: true,
      message: 'Captcha synchronisé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la définition du captcha:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la synchronisation du captcha'
    });
  }
});



// Endpoint de vérification du captcha
router.post('/verify-captcha', async (req, res) => {
  try {
    const { captcha } = req.body;
    
    // Logging pour débogage
    console.log('Captcha soumis:', captcha);
    console.log('Captcha en session:', req.session.captcha);
    console.log('Session ID:', req.sessionID);
    
    // Vérification additionnelle pour le débogage
    console.log('Contenu complet de la session:', req.session);
    
    // Si pas de captcha en session, en générer un nouveau
    if (!req.session.captcha) {
      console.log('Captcha non trouvé en session, génération d\'un nouveau');
      // Génération d'un captcha de base pour éviter les erreurs
      req.session.captcha = captcha;
      req.session.captchaGeneratedTime = new Date().getTime();
    }
    
    // Vérification avec tolérance (insensible à la casse + espaces)
    const normalizedInput = captcha.toLowerCase().replace(/\s+/g, '');
    const normalizedStored = req.session.captcha.toLowerCase().replace(/\s+/g, '');
    
    const isMatch = normalizedInput === normalizedStored;
    console.log('Comparaison:', normalizedInput, '==', normalizedStored, '=>', isMatch);
    
    if (!isMatch) {
      // Incrémenter le compteur d'échecs
      req.session.captchaFailures = (req.session.captchaFailures || 0) + 1;
      console.log('Échec de vérification, tentatives:', req.session.captchaFailures);
      
      // Forcer la sauvegarde de session
      req.session.save();
      
      // Vérifier si le nombre maximum d'échecs est atteint
      if (req.session.captchaFailures >= 2) {
        req.session.captchaBlocked = true;
        req.session.captchaBlockedUntil = new Date().getTime() + (15 * 60 * 1000);
        
        return res.status(429).json({
          success: false,
          message: 'Trop de tentatives incorrectes. Veuillez réessayer dans 15 minutes.'
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'Code captcha invalide',
        attemptsLeft: 2 - req.session.captchaFailures
      });
    }
    
    // Réinitialiser le compteur d'échecs en cas de succès
    req.session.captchaFailures = 0;
    
    // Générer un jeton temporaire pour la soumission
    const formToken = crypto.randomBytes(16).toString('hex');
    req.session.formToken = formToken;
    req.session.formTokenExpires = new Date().getTime() + (5 * 60 * 1000);
    
    // Forcer la sauvegarde de la session
    req.session.save();
    
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
});

// Endpoint de contact
router.post('/contact', contactLimiter, contactValidation, async (req, res) => {
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

    // Création du transporteur et envoi de l'email
    try {
      const transporter = createTransporter();
      await transporter.sendMail(mailOptions);
      
      // Réinitialiser le captcha et le token après une tentative réussie
      req.session.captcha = null;
      req.session.formToken = null;
      
      // Réponse au client
      res.status(200).json({
        success: true,
        message: 'Message envoyé avec succès'
      });
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de l\'envoi de l\'email'
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message'
    });
  }
});

export default router;