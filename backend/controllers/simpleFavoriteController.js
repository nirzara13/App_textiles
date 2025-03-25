// controllers/simpleFavoriteController.js
import db from '../models/index.js';

// Valeurs autorisées pour le champ frequency_of_use
const VALID_FREQUENCIES = ['Rarement', 'Occasionnellement', 'Régulièrement', 'Fréquemment'];

export const getFavorites = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Requête SQL optimisée pour récupérer tous les détails nécessaires
    const [favorites] = await db.sequelize.query(`
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.image_url, 
        c.name as category_name,
        f.frequency_of_use, 
        f.usage_context, 
        f.personal_notes
      FROM favorites f
      JOIN textiles t ON f.textile_id = t.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE f.user_id = ?
    `, {
      replacements: [userId]
    });
    
    console.log('Favoris récupérés de la base:', favorites);
    
    // Structure simplifiée et directe pour le frontend
    res.json({
      success: true,
      favorites: favorites.map(f => ({
        id: f.id,
        name: f.name || `Textile ${f.id}`,
        description: f.description || '',
        image_url: f.image_url,
        category: { name: f.category_name || 'Non disponible' },
        frequency_of_use: f.frequency_of_use,
        usage_context: f.usage_context,
        personal_notes: f.personal_notes
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
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
    
    // Log des données reçues pour débogage
    console.log('Request body:', req.body);
    
    // Valider et normaliser la fréquence d'utilisation
    let frequency_of_use = 'Occasionnellement'; // Valeur par défaut
    if (req.body.frequency_of_use) {
      // Vérifier si la valeur est dans la liste des valeurs autorisées
      const normalizedFreq = req.body.frequency_of_use.trim();
      if (VALID_FREQUENCIES.includes(normalizedFreq)) {
        frequency_of_use = normalizedFreq;
      } else {
        console.warn(`Fréquence invalide reçue: "${req.body.frequency_of_use}". Utilisation de la valeur par défaut.`);
      }
    }
    
    const usage_context = req.body.usage_context || null;
    const personal_notes = req.body.personal_notes || null;
    
    console.log('Données validées à insérer:', {
      userId,
      textileId,
      frequency_of_use,
      usage_context,
      personal_notes
    });
    
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
    
    // Ajouter aux favoris - Requête SQL explicite pour insérer tous les champs
    await db.sequelize.query(`
      INSERT INTO favorites 
        (user_id, textile_id, frequency_of_use, usage_context, personal_notes, created_at, updated_at)
      VALUES 
        (?, ?, ?, ?, ?, NOW(), NOW())
    `, {
      replacements: [userId, textileId, frequency_of_use, usage_context, personal_notes]
    });
    
    // Récupérer le textile nouvellement ajouté
    const [newFavorite] = await db.sequelize.query(`
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.image_url, 
        c.name as category_name,
        f.frequency_of_use, 
        f.usage_context, 
        f.personal_notes
      FROM favorites f
      JOIN textiles t ON f.textile_id = t.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE f.user_id = ? AND t.id = ?
    `, {
      replacements: [userId, textileId]
    });
    
    // Retourner une réponse complète avec les données du favori ajouté
    res.status(201).json({
      success: true,
      message: 'Favori ajouté avec succès',
      favorite: newFavorite[0] ? {
        id: newFavorite[0].id,
        name: newFavorite[0].name,
        description: newFavorite[0].description,
        image_url: newFavorite[0].image_url,
        category: { name: newFavorite[0].category_name || 'Non disponible' },
        frequency_of_use: newFavorite[0].frequency_of_use,
        usage_context: newFavorite[0].usage_context,
        personal_notes: newFavorite[0].personal_notes
      } : null
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du favori:', error);
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
    
    // Supprimer le favori avec une requête SQL directe
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
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du favori'
    });
  }
};

export const updateFavoriteDetails = async (req, res) => {
  try {
    const { textileId } = req.params;
    const userId = req.userId;
    
    // Log des données reçues pour débogage
    console.log('Request body for update:', req.body);
    
    // Valider et normaliser la fréquence d'utilisation
    let frequency_of_use = 'Occasionnellement'; // Valeur par défaut
    if (req.body.frequency_of_use) {
      // Vérifier si la valeur est dans la liste des valeurs autorisées
      const normalizedFreq = req.body.frequency_of_use.trim();
      if (VALID_FREQUENCIES.includes(normalizedFreq)) {
        frequency_of_use = normalizedFreq;
      } else {
        console.warn(`Fréquence invalide reçue pour mise à jour: "${req.body.frequency_of_use}". Utilisation de la valeur par défaut.`);
      }
    }
    
    const usage_context = req.body.usage_context;
    const personal_notes = req.body.personal_notes;
    
    console.log('Données validées pour mise à jour:', {
      frequency_of_use,
      usage_context,
      personal_notes
    });
    
    // Vérifier si le favori existe
    const [existing] = await db.sequelize.query(`
      SELECT id FROM favorites WHERE user_id = ? AND textile_id = ?
    `, {
      replacements: [userId, textileId]
    });
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Favori non trouvé'
      });
    }
    
    // Mettre à jour les détails avec une requête SQL explicite
    await db.sequelize.query(`
      UPDATE favorites 
      SET 
        frequency_of_use = ?,
        usage_context = ?,
        personal_notes = ?,
        updated_at = NOW()
      WHERE user_id = ? AND textile_id = ?
    `, {
      replacements: [
        frequency_of_use,
        usage_context,
        personal_notes,
        userId,
        textileId
      ]
    });
    
    // Récupérer le favori mis à jour
    const [updatedFavorite] = await db.sequelize.query(`
      SELECT 
        t.id, 
        t.name, 
        t.description, 
        t.image_url, 
        c.name as category_name,
        f.frequency_of_use, 
        f.usage_context, 
        f.personal_notes
      FROM favorites f
      JOIN textiles t ON f.textile_id = t.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE f.user_id = ? AND t.id = ?
    `, {
      replacements: [userId, textileId]
    });
    
    // Retourner une réponse avec les données mises à jour
    res.json({
      success: true,
      message: 'Détails du favori mis à jour avec succès',
      favorite: updatedFavorite[0] ? {
        id: updatedFavorite[0].id,
        name: updatedFavorite[0].name,
        description: updatedFavorite[0].description,
        image_url: updatedFavorite[0].image_url,
        category: { name: updatedFavorite[0].category_name || 'Non disponible' },
        frequency_of_use: updatedFavorite[0].frequency_of_use,
        usage_context: updatedFavorite[0].usage_context,
        personal_notes: updatedFavorite[0].personal_notes
      } : null
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des détails:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour des détails du favori'
    });
  }
};

export default {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateFavoriteDetails
};