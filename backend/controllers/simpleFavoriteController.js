// controllers/simpleFavoriteController.js
import db from '../models/index.js';

export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Requête SQL directe pour récupérer les favoris
    const [favorites] = await db.sequelize.query(`
      SELECT f.id as favorite_id, t.id, t.name, t.description, c.name as category_name
      FROM favorites f
      JOIN textiles t ON f.textile_id = t.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE f.user_id = ?
    `, {
      replacements: [userId]
    });
    
    res.json({
      success: true,
      favorites: favorites.map(f => ({
        id: f.id,
        name: f.name || `Textile ${f.id}`,
        description: f.description || '',
        category: { name: f.category_name || 'Non disponible' }
      }))
    });
  } catch (error) {
    console.error('Erreur favoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des favoris'
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Vérifier si le textile existe
    const [textiles] = await db.sequelize.query(`
      SELECT id FROM textiles WHERE id = ?
    `, {
      replacements: [textileId]
    });
    
    if (textiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Textile non trouvé'
      });
    }
    
    // Vérifier si déjà en favoris
    const [existing] = await db.sequelize.query(`
      SELECT id FROM favorites WHERE user_id = ? AND textile_id = ?
    `, {
      replacements: [userId, textileId]
    });
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ce textile est déjà dans vos favoris'
      });
    }
    
    // Ajouter aux favoris avec SQL direct
    await db.sequelize.query(`
      INSERT INTO favorites (user_id, textile_id, created_at)
      VALUES (?, ?, NOW())
    `, {
      replacements: [userId, textileId]
    });
    
    res.status(201).json({
      success: true,
      message: 'Favori ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur ajout favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du favori'
    });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Supprimer le favori avec SQL direct
    await db.sequelize.query(`
      DELETE FROM favorites 
      WHERE user_id = ? AND textile_id = ?
    `, {
      replacements: [userId, textileId]
    });
    
    res.json({
      success: true,
      message: 'Favori supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du favori'
    });
  }
};