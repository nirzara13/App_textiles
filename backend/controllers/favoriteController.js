

// // controllers/favoriteController.js
// import db from '../models/index.js';

// // Dans getFavorites
// export const getFavorites = async (req, res) => {
//   try {
//     const user = await db.User.findByPk(req.userId, {
//       include: [{
//         model: db.Textile,
//         as: 'favoritedTextiles',  // Utilisez cet alias au lieu de 'favorites'
//         through: { attributes: [] }
//       }]
//     });

//     const favorites = user.favoritedTextiles.map(textile => ({
//       id: textile.id,
//       name: textile.name,
//       description: textile.description,
//       // autres propriétés...
//     }));

//     res.json({
//       success: true,
//       favorites: favorites
//     });
//   } catch (error) {
//     console.error('Erreur lors de la récupération des favoris:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Erreur lors de la récupération des favoris'
//     });
//   }
// };

// // Dans addFavorite
// // export const addFavorite = async (req, res) => {
// //   try {
// //     const { textileId } = req.params;
// //     const userId = req.userId;
    
// //     const user = await db.User.findByPk(userId);
// //     const textile = await db.Textile.findByPk(textileId);
    
// //     if (!textile) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Textile non trouvé'
// //       });
// //     }
    
// //     // Utiliser addFavoritedTextile (qui correspond à l'alias 'favoritedTextiles')
// //     await user.addFavoritedTextile(textile);
    
// //     res.status(201).json({
// //       success: true,
// //       message: 'Favori ajouté avec succès'
// //     });
// //   } catch (error) {
// //     console.error('Erreur lors de l\'ajout du favori:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Erreur lors de l\'ajout du favori'
// //     });
// //   }
// // };

// // // Dans removeFavorite
// // export const removeFavorite = async (req, res) => {
// //   try {
// //     const { textileId } = req.params;
// //     const userId = req.userId;
    
// //     const user = await db.User.findByPk(userId);
// //     const textile = await db.Textile.findByPk(textileId);
    
// //     if (!textile) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'Textile non trouvé'
// //       });
// //     }
    
// //     // Utiliser removeFavoritedTextile (qui correspond à l'alias 'favoritedTextiles')
// //     await user.removeFavoritedTextile(textile);
    
// //     res.json({
// //       success: true,
// //       message: 'Favori supprimé avec succès'
// //     });
// //   } catch (error) {
// //     console.error('Erreur lors de la suppression du favori:', error);
// //     res.status(500).json({
// //       success: false,
// //       message: 'Erreur lors de la suppression du favori'
// //     });
// //   }
// // };



// // controllers/favoriteController.js
// export const addFavorite = async (req, res) => {
//   try {
//     const { textileId } = req.params;
//     const userId = req.userId;
    
//     // Nouvelles informations optionnelles
//     const { 
//       usage_context, 
//       frequency_of_use, 
//       personal_notes 
//     } = req.body;
    
//     const user = await db.User.findByPk(userId);
//     const textile = await db.Textile.findByPk(textileId);
    
//     if (!textile) {
//       return res.status(404).json({
//         success: false,
//         message: 'Textile non trouvé'
//       });
//     }
    
//     // Créer le favori avec informations supplémentaires
//     await db.Favorite.create({
//       user_id: userId,
//       textile_id: textileId,
//       usage_context,
//       frequency_of_use,
//       personal_notes
//     });
    
//     res.status(201).json({
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
// };

// export const removeFavorite = async (req, res) => {
//   try {
//     const { textileId } = req.params;
//     const userId = req.userId;
    
//     // Supprimer le favori spécifique
//     const result = await db.Favorite.destroy({
//       where: { 
//         user_id: userId, 
//         textile_id: textileId 
//       }
//     });
    
//     if (result === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Favori non trouvé'
//       });
//     }
    
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
// };



































// controllers/favoriteController.js
import db from '../models/index.js';

// Récupérer tous les favoris de l'utilisateur connecté
export const getFavorites = async (req, res) => {
  try {
    // Récupérer les favoris avec les informations additionnelles
    const favorites = await db.Favorite.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: db.Textile,
          as: 'textile',
          include: [
            {
              model: db.Category,
              as: 'category',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    // Transformer les données pour un format plus propre
    const formattedFavorites = favorites.map(favorite => {
      const textile = favorite.textile ? {
        id: favorite.textile.id,
        name: favorite.textile.name,
        description: favorite.textile.description,
        category: favorite.textile.category,
        // Ajouter les propriétés de la table Favorite
        frequency_of_use: favorite.frequency_of_use,
        usage_context: favorite.usage_context,
        personal_notes: favorite.personal_notes
      } : null;
      
      return textile;
    }).filter(item => item !== null);

    res.json({
      success: true,
      favorites: formattedFavorites
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des favoris'
    });
  }
};

// Ajouter un textile aux favoris avec informations additionnelles
export const addFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Nouvelles informations optionnelles
    const { 
      usage_context, 
      frequency_of_use = 'Occasionnellement', // Valeur par défaut
      personal_notes 
    } = req.body;
    
    // Vérifier si ce textile existe
    const textile = await db.Textile.findByPk(textileId);
    if (!textile) {
      return res.status(404).json({
        success: false,
        message: 'Textile non trouvé'
      });
    }
    
    // Vérifier si ce favori existe déjà
    const existingFavorite = await db.Favorite.findOne({
      where: {
        user_id: userId,
        textile_id: textileId
      }
    });
    
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Ce textile est déjà dans vos favoris'
      });
    }
    
    // Créer le favori avec informations supplémentaires
    await db.Favorite.create({
      user_id: userId,
      textile_id: textileId,
      usage_context,
      frequency_of_use,
      personal_notes
    });
    
    res.status(201).json({
      success: true,
      message: 'Favori ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du favori'
    });
  }
};

// Supprimer un textile des favoris
export const removeFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Supprimer le favori spécifique
    const result = await db.Favorite.destroy({
      where: { 
        user_id: userId, 
        textile_id: textileId 
      }
    });
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Favori supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du favori'
    });
  }
};

// Mettre à jour les détails d'un favori
export const updateFavoriteDetails = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Récupérer les données à mettre à jour
    const { 
      usage_context, 
      frequency_of_use, 
      personal_notes 
    } = req.body;
    
    // Trouver le favori
    const favorite = await db.Favorite.findOne({
      where: {
        user_id: userId,
        textile_id: textileId
      }
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }
    
    // Préparer les données à mettre à jour
    const updateData = {};
    
    if (frequency_of_use !== undefined) {
      updateData.frequency_of_use = frequency_of_use;
    }
    
    if (usage_context !== undefined) {
      updateData.usage_context = usage_context;
    }
    
    if (personal_notes !== undefined) {
      updateData.personal_notes = personal_notes;
    }
    
    // Ajouter la date de mise à jour
    updateData.updated_at = new Date();
    
    // Mettre à jour le favori
    await favorite.update(updateData);
    
    res.json({
      success: true,
      message: 'Détails du favori mis à jour avec succès',
      favorite: favorite
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des détails:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des détails du favori'
    });
  }
};

// Récupérer un favori spécifique avec détails avancés
export const getFavoriteDetails = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Trouver le favori avec toutes les informations associées
    const favorite = await db.Favorite.findOne({
      where: {
        user_id: userId,
        textile_id: textileId
      },
      include: [
        {
          model: db.Textile,
          as: 'textile',
          include: [
            {
              model: db.Category,
              as: 'category'
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
        }
      ]
    });
    
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }
    
    res.json({
      success: true,
      favorite: favorite
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des détails du favori'
    });
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoriteDetails,
  getFavoriteDetails
};