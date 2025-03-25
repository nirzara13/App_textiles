// // middleware/auth.js
// import jwt from 'jsonwebtoken';

// export const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentification requise'
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.id;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: 'Token invalide'
//     });
//   }
// };





// middleware/auth.js
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import db from '../models/index.js';
// import passwordValidator from './passwordValidator.js';

// const router = express.Router();

// // Inscription
// router.post('/signup', passwordValidator, async (req, res) => {
//   try {
//     const { email, password } = req.body;
   
//     const existingUser = await db.User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cet email est déjà utilisé'
//       });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await db.User.create({
//       email,
//       password: hashedPassword
//     });
//     res.status(201).json({
//       success: true,
//       message: 'Inscription réussie'
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de l\'inscription'
//     });
//   }
// });

// // Connexion
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
   
//     const user = await db.User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Email ou mot de passe incorrect'
//       });
//     }
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({
//         success: false,
//         message: 'Email ou mot de passe incorrect'
//       });
//     }
//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );
//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la connexion'
//     });
//   }
// });

// // Middleware d'authentification
// const auth = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Authentication requise' });
//   }
// };

// // Obtenir le profil utilisateur
// router.get('/profile', auth, async (req, res) => {
//   try {
//     const user = await db.User.findByPk(req.userId, {
//       attributes: ['id', 'email'],
//       include: [{
//         model: db.Textile,
//         as: 'favorites',
//         through: { attributes: [] }
//       }]
//     });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });

// // Modifier le profil
// router.put('/profile', auth, async (req, res) => {
//   try {
//     const { email, currentPassword, newPassword } = req.body;
//     const user = await db.User.findByPk(req.userId);

//     // Vérifier le mot de passe actuel
//     const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Mot de passe actuel incorrect'
//       });
//     }

//     const updates = {};
   
//     if (email) updates.email = email;
//     if (newPassword) {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);
//       updates.password = hashedPassword;
//     }

//     await db.User.update(updates, {
//       where: { id: req.userId }
//     });

//     res.json({ 
//       success: true,
//       message: 'Profil mis à jour',
//       user: {
//         id: req.userId,
//         email: updates.email || user.email
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la mise à jour du profil' 
//     });
//   }
// });

// // Supprimer le compte
// router.delete('/profile', auth, async (req, res) => {
//   try {
//     const { password } = req.body;
//     const user = await db.User.findByPk(req.userId);

//     // Vérifier le mot de passe
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: 'Mot de passe incorrect'
//       });
//     }

//     await db.User.destroy({
//       where: { id: req.userId }
//     });

//     res.json({ 
//       success: true,
//       message: 'Compte supprimé' 
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Erreur lors de la suppression du compte' 
//     });
//   }
// });

// export default router;
// export { auth as authMiddleware };


// middleware/auth.js
// middleware/auth.js
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe et a le bon rôle
    const user = await db.User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    req.userId = decoded.userId;
    req.userRole = user.role; // Ajouter le rôle à la requête
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

export default authMiddleware;