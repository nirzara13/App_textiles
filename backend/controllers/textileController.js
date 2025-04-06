

// controllers/textileController.js

// Importation des modèles 

import db from '../models/index.js';
const { Textile, Tissu } = db;

// Récupérer tous les textiles
export const getAllTextiles = async (req, res) => {
  try {
    // Aucun changement nécessaire ici car findAll() récupère automatiquement 
    // toutes les colonnes, y compris la nouvelle colonne image_url
    const textiles = await Textile.findAll();
    res.json(textiles);
  } catch (error) {
    console.error('Erreur lors de la récupération des textiles:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des textiles' 
    });
  }
};

// Récupérer un textile par son ID
export const getTextileById = async (req, res) => {
  try {
    // Aucun changement nécessaire ici - findByPk récupère déjà toutes les colonnes
    const textile = await Textile.findByPk(req.params.id);
    
    if (!textile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Textile non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: textile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du textile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération du textile' 
    });
  }
};



// Récupérer un textile avec ses tissus (relation 1:N)
export const getTextileWithTissus = async (req, res) => {
  try {
    // Aucun changement nécessaire ici
    const textile = await Textile.findByPk(req.params.id, {
      include: [{
        model: Tissu,
        as: 'tissus'
      }]
    });
    
    if (!textile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Textile non trouvé' 
      });
    }
    
    res.json({
      success: true,
      data: textile
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du textile avec tissus:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de la récupération des tissus du textile' 
    });
  }
};



export const createTextile = async (req, res) => {
  try {
    // Cette fonction acceptera automatiquement le champ image_url dans req.body
    // Il faudra simplement s'assurer que votre formulaire de création inclut ce champ
    const textile = await Textile.create(req.body);
    res.status(201).json(textile);
  } catch (error) {
    console.error('Error creating textile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating textile'
    }); 
  }
};

export const deleteTextile = async (req, res) => {
  try {
    // Aucun changement nécessaire ici
    const textile = await Textile.findByPk(req.params.id);
    if (!textile) {
      return res.status(404).json({ message: 'Textile not found' });
    }
    await textile.destroy();
    res.json({ message: 'Textile deleted' });
  } catch (error) {
    console.error('Error deleting textile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTextile = async (req, res) => {
  try {
    // Cette fonction acceptera automatiquement la mise à jour du champ image_url dans req.body
    // Il faudra s'assurer que votre formulaire de mise à jour inclut ce champ
    const textile = await Textile.findByPk(req.params.id);
    if (!textile) {
      return res.status(404).json({ message: 'Textile not found' });
    }
    await textile.update(req.body);
    res.json(textile);
  } catch (error) {
    console.error('Error updating textile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};