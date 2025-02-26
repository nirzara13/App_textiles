

// controllers/favoriteController.js
import db from '../models/index.js';

// Dans getFavorites
export const getFavorites = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.userId, {
      include: [{
        model: db.Textile,
        as: 'favoritedTextiles',  // Utilisez cet alias au lieu de 'favorites'
        through: { attributes: [] }
      }]
    });

    const favorites = user.favoritedTextiles.map(textile => ({
      id: textile.id,
      name: textile.name,
      description: textile.description,
      // autres propriétés...
    }));

    res.json({
      success: true,
      favorites: favorites
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des favoris'
    });
  }
};

// Dans addFavorite
export const addFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    const user = await db.User.findByPk(userId);
    const textile = await db.Textile.findByPk(textileId);
    
    if (!textile) {
      return res.status(404).json({
        success: false,
        message: 'Textile non trouvé'
      });
    }
    
    // Utiliser addFavoritedTextile (qui correspond à l'alias 'favoritedTextiles')
    await user.addFavoritedTextile(textile);
    
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

// Dans removeFavorite
export const removeFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    const user = await db.User.findByPk(userId);
    const textile = await db.Textile.findByPk(textileId);
    
    if (!textile) {
      return res.status(404).json({
        success: false,
        message: 'Textile non trouvé'
      });
    }
    
    // Utiliser removeFavoritedTextile (qui correspond à l'alias 'favoritedTextiles')
    await user.removeFavoritedTextile(textile);
    
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