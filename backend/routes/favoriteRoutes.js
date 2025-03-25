// // routes/favoritesRoutes.js
// import express from 'express';
// import { authMiddleware } from '../middleware/auth.js';
// import models from '../models/index.js';

// const { User, Textile, Category } = models;
// const router = express.Router();

// // Toutes les routes de ce fichier nécessitent une authentification
// router.use(authMiddleware);

// // Récupérer tous les favoris de l'utilisateur
// router.get('/', async (req, res) => {
//   try {
//     const userId = req.userId;
//     const favorites = await models.sequelize.query(`
//       SELECT t.*, c.name as category_name
//       FROM favorites f
//       JOIN textiles t ON f.textile_id = t.id
//       LEFT JOIN categories c ON t.category_id = c.id
//       WHERE f.user_id = ?
//     `, {
//       replacements: [userId],
//       type: models.sequelize.QueryTypes.SELECT
//     });

//     console.log("Favoris récupérés:", favorites.length);

//     res.json({
//       success: true,
//       favorites: favorites.map(f => ({
//         id: f.id,
//         name: f.name,
//         description: f.description,
//         category: {
//           name: f.category_name
//         },
//         image_url: f.image_url || null
//       }))
//     });
//   } catch (error) {
//     console.error('Erreur lors de la récupération des favoris:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération des favoris'
//     });
//   }
// });

// // Ajouter un favori
// router.post('/:textileId', async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { textileId } = req.params;

//     console.log(`Ajout du textile ${textileId} aux favoris de l'utilisateur ${userId}`);

//     // Vérifier si le textile existe
//     const textile = await Textile.findByPk(textileId);
//     if (!textile) {
//       return res.status(404).json({
//         success: false,
//         message: 'Matière textile non trouvée'
//       });
//     }

//     // Vérifier si ce favori existe déjà
//     const existingFavorite = await models.sequelize.query(`
//       SELECT * FROM favorites
//       WHERE user_id = ? AND textile_id = ?
//     `, {
//       replacements: [userId, textileId],
//       type: models.sequelize.QueryTypes.SELECT
//     });

//     if (existingFavorite.length > 0) {
//       return res.json({
//         success: true,
//         message: 'Ce favori existe déjà'
//       });
//     }

//     // Ajouter le favori
//     await models.sequelize.query(`
//       INSERT INTO favorites (user_id, textile_id, created_at)
//       VALUES (?, ?, NOW())
//     `, {
//       replacements: [userId, textileId]
//     });

//     res.json({
//       success: true,
//       message: 'Favori ajouté avec succès'
//     });
//   } catch (error) {
//     console.error('Erreur lors de l\'ajout du favori:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de l\'ajout du favori'
//     });
//   }
// });

// // Supprimer un favori
// router.delete('/:textileId', async (req, res) => {
//   try {
//     const userId = req.userId;
//     const { textileId } = req.params;

//     console.log(`Suppression du textile ${textileId} des favoris de l'utilisateur ${userId}`);

//     // Supprimer le favori
//     await models.sequelize.query(`
//       DELETE FROM favorites
//       WHERE user_id = ? AND textile_id = ?
//     `, {
//       replacements: [userId, textileId]
//     });

//     res.json({
//       success: true,
//       message: 'Favori supprimé avec succès'
//     });
//   } catch (error) {
//     console.error('Erreur lors de la suppression du favori:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la suppression du favori'
//     });
//   }
// });

// export default router;




// // routes/favoriteRoutes.js
// import express from 'express';
// import AuthController from '../controllers/authController.js';
// import { authMiddleware } from '../middleware/auth.js';

// const router = express.Router();

// router.use(authMiddleware);

// router.get('/', AuthController.getFavorites);
// router.post('/:textileId', AuthController.addFavorite);
// router.delete('/:textileId', AuthController.removeFavorite);

// // Ajoutez cette route au début de votre fichier routes/favoriteRoutes.js
// router.get('/debug', async (req, res) => {
//   try {
//     // 1. Vérifier si la table existe
//     const [tables] = await db.sequelize.query(`
//       SHOW TABLES LIKE 'favorites'
//     `);
    
//     // 2. Vérifier la structure de la table
//     const [columns] = await db.sequelize.query(`
//       DESCRIBE favorites
//     `);
    
//     // 3. Tester une requête simple
//     const [count] = await db.sequelize.query(`
//       SELECT COUNT(*) as count FROM favorites
//     `);
    
//     res.json({
//       success: true,
//       tables,
//       columns,
//       count: count[0].count
//     });
//   } catch (error) {
//     console.error('Erreur debug:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur debug',
//       error: error.message,
//       stack: error.stack
//     });
//   }
// });

// export default router;


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
          model: db.TextileCharacteristics,
          as: 'characteristics'
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