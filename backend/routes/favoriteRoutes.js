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




// routes/favoriteRoutes.js
import express from 'express';
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', AuthController.getFavorites);
router.post('/:textileId', AuthController.addFavorite);
router.delete('/:textileId', AuthController.removeFavorite);

// Ajoutez cette route au début de votre fichier routes/favoriteRoutes.js
router.get('/debug', async (req, res) => {
  try {
    // 1. Vérifier si la table existe
    const [tables] = await db.sequelize.query(`
      SHOW TABLES LIKE 'favorites'
    `);
    
    // 2. Vérifier la structure de la table
    const [columns] = await db.sequelize.query(`
      DESCRIBE favorites
    `);
    
    // 3. Tester une requête simple
    const [count] = await db.sequelize.query(`
      SELECT COUNT(*) as count FROM favorites
    `);
    
    res.json({
      success: true,
      tables,
      columns,
      count: count[0].count
    });
  } catch (error) {
    console.error('Erreur debug:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur debug',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;