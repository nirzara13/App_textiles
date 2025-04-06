

// routes/favoriteRoutes.js
import express from 'express';
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import db from '../models/index.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes principales
router.get('/', AuthController.getFavorites);
router.post('/:textileId', AuthController.addFavorite);
router.delete('/:textileId', AuthController.removeFavorite);
router.put('/:textileId/details', AuthController.updateFavoriteDetails);

// Route pour récupérer les détails d'un favori par son ID (nécessaire pour l'erreur 404)
router.get('/:id/details', async (req, res) => {
  try {
    const userId = req.userId;
    const favoriteId = req.params.id;
    
    // Vérifier que le favori appartient bien à l'utilisateur (sécurité)
    const favorite = await db.Favorite.findOne({
      where: {
        id: favoriteId,
        user_id: userId
      }
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }
    
    // Joindre les informations du textile si nécessaire
    const textile = await db.Textile.findByPk(favorite.textile_id, {
      include: [
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name']
        },
      
        {
          model: db.Tissu,
          as: 'tissus',
          include: [
            {
              model: db.Textile,
              as: 'compositionTextiles',
              through: {
                model: db.Composition,
                attributes: ['percentage']
              }
            }
          ]
        }
      ]
    });
    
    res.json({
      success: true,
      favorite: {
        ...favorite.get({ plain: true }),
        textile: textile ? textile.get({ plain: true }) : null
      }
    });
  } catch (error) {
    console.error('Erreur détails favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du favori'
    });
  }
});

// Route pour mettre à jour les détails d'un favori par son ID
router.put('/:id/details', async (req, res) => {
  try {
    const userId = req.userId;
    const favoriteId = req.params.id;
    const { usage_context, frequency_of_use, personal_notes } = req.body;
    
    // Vérifier que le favori appartient bien à l'utilisateur (sécurité)
    const favorite = await db.Favorite.findOne({
      where: {
        id: favoriteId,
        user_id: userId
      }
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }
    
    // Mettre à jour les détails du favori
    await favorite.update({
      usage_context: usage_context !== undefined ? usage_context : favorite.usage_context,
      frequency_of_use: frequency_of_use !== undefined ? frequency_of_use : favorite.frequency_of_use,
      personal_notes: personal_notes !== undefined ? personal_notes : favorite.personal_notes,
      updated_at: new Date()
    });
    
    res.json({
      success: true,
      message: 'Détails du favori mis à jour avec succès',
      favorite: favorite
    });
  } catch (error) {
    console.error('Erreur mise à jour détails:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des détails du favori'
    });
  }
});



// Version sécurisée de la route de débogage
router.get('/debug', async (req, res) => {
  try {
    // Requête simple et sécurisée
    const [count] = await db.sequelize.query(`
      SELECT COUNT(*) as count FROM favorites WHERE user_id = ?
    `, {
      replacements: [req.userId]
    });
    
    // Retourner seulement les informations nécessaires
    res.json({
      success: true,
      userFavoritesCount: count[0].count
    });
  } catch (error) {
    console.error('Erreur debug:', error);
    // Ne pas exposer les détails de l'erreur
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue'
    });
  }
});

export default router;