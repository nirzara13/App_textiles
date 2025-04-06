


// routes/profileRoutes.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import models from '../models/index.js';
import bcrypt from 'bcrypt';

const { User } = models;
const router = express.Router();

// Vérification de base - AJOUTER CETTE ROUTE DE TEST
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API profile fonctionne!'
  });
});

// Récupérer le profil (sans middleware pour tester)
router.get('/debug', async (req, res) => {
  res.json({
    success: true,
    message: 'Point de débogage sans authentification',
    headers: req.headers
  });
});

// Toutes les routes en dessous nécessitent une authentification
router.use(authMiddleware);

// Récupérer le profil
router.get('/', async (req, res) => {
  console.log('GET /api/profile - userId:', req.userId);
  
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      console.log('Utilisateur non trouvé:', req.userId);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    console.log('Profil récupéré avec succès:', user.id);
    
    // Retourner un format simplifié et cohérent
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        // autres champs à ajouter si nécessaire
      }
    });
  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// Mettre à jour le profil
// Mettre à jour le profil
router.put('/', async (req, res) => {
  console.log('PUT /api/profile - userId:', req.userId);
  console.log('Données reçues:', req.body);
  
  try {
    const { email, password, newPassword } = req.body;
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Mettre à jour les données
    if (email) user.email = email;
    
    // Si un nouveau mot de passe est fourni, le mettre à jour
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    
    await user.save();
    console.log('Profil mis à jour:', user.id);
    
    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});
  
// Supprimer le compte
router.delete('/', async (req, res) => {
  console.log('DELETE /api/profile - userId:', req.userId);
  
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    await user.destroy();
    console.log('Compte supprimé:', req.userId);
    
    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte'
    });
  }
});

export default router;