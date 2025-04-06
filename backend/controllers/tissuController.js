// controllers/tissuController.js
const { Tissu, Textile, Composition } = require('../models');

// Récupérer tous les tissus
exports.getAllTissus = async (req, res) => {
  try {
    const tissus = await Tissu.findAll({
      include: [
        {
          model: Textile,
          as: 'textile',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: tissus.length,
      tissus
    });
  } catch (error) {
    console.error('Error getting tissus:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des tissus'
    });
  }
};

// Récupérer un tissu par son ID
exports.getTissuById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tissu = await Tissu.findByPk(id, {
      include: [
        {
          model: Textile,
          as: 'textile',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Textile,
          as: 'compositionTextiles',
          through: {
            model: Composition,
            attributes: ['percentage']
          }
        }
      ]
    });
    
    if (!tissu) {
      return res.status(404).json({
        success: false,
        message: 'Tissu non trouvé'
      });
    }
    
    return res.status(200).json({
      success: true,
      tissu
    });
  } catch (error) {
    console.error('Error getting tissu by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération du tissu'
    });
  }
};

// Récupérer les tissus liés à un textile spécifique
exports.getTissusByTextileId = async (req, res) => {
  try {
    const { textileId } = req.params;
    
    const tissus = await Tissu.findAll({
      where: { textile_id: textileId },
      include: [
        {
          model: Textile,
          as: 'compositionTextiles',
          through: {
            model: Composition,
            attributes: ['percentage']
          }
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: tissus.length,
      tissus
    });
  } catch (error) {
    console.error('Error getting tissus by textile ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des tissus'
    });
  }
};

// Créer un nouveau tissu
exports.createTissu = async (req, res) => {
  try {
    const {
      textile_id,
      name,
      weave_type,
      description,
      image_url,
      recommended_use,
      care_instructions,
      compositions
    } = req.body;
    
    // Vérifier si le textile existe
    const textile = await Textile.findByPk(textile_id);
    if (!textile) {
      return res.status(404).json({
        success: false,
        message: 'Textile non trouvé'
      });
    }
    
    // Créer le tissu
    const tissu = await Tissu.create({
      textile_id,
      name,
      weave_type,
      description,
      image_url,
      recommended_use,
      care_instructions
    });
    
    // Créer les compositions si fournies
    if (compositions && Array.isArray(compositions)) {
      const compositionPromises = compositions.map(comp => {
        return Composition.create({
          tissu_id: tissu.id,
          textile_id: comp.textile_id,
          percentage: comp.percentage
        });
      });
      
      await Promise.all(compositionPromises);
    }
    
    // Récupérer le tissu avec ses compositions
    const createdTissu = await Tissu.findByPk(tissu.id, {
      include: [
        {
          model: Textile,
          as: 'textile',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Textile,
          as: 'compositionTextiles',
          through: {
            model: Composition,
            attributes: ['percentage']
          }
        }
      ]
    });
    
    return res.status(201).json({
      success: true,
      message: 'Tissu créé avec succès',
      tissu: createdTissu
    });
  } catch (error) {
    console.error('Error creating tissu:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la création du tissu',
      error: error.message
    });
  }
};

// Mettre à jour un tissu
exports.updateTissu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      textile_id,
      name,
      weave_type,
      description,
      image_url,
      recommended_use,
      care_instructions,
      compositions
    } = req.body;
    
    // Vérifier si le tissu existe
    const tissu = await Tissu.findByPk(id);
    if (!tissu) {
      return res.status(404).json({
        success: false,
        message: 'Tissu non trouvé'
      });
    }
    
    // Mettre à jour le tissu
    await tissu.update({
      textile_id,
      name,
      weave_type,
      description,
      image_url,
      recommended_use,
      care_instructions
    });
    
    // Mettre à jour les compositions si fournies
    if (compositions && Array.isArray(compositions)) {
      // Supprimer les compositions existantes
      await Composition.destroy({
        where: { tissu_id: id }
      });
      
      // Créer les nouvelles compositions
      const compositionPromises = compositions.map(comp => {
        return Composition.create({
          tissu_id: id,
          textile_id: comp.textile_id,
          percentage: comp.percentage
        });
      });
      
      await Promise.all(compositionPromises);
    }
    
    // Récupérer le tissu mis à jour avec ses compositions
    const updatedTissu = await Tissu.findByPk(id, {
      include: [
        {
          model: Textile,
          as: 'textile',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Textile,
          as: 'compositionTextiles',
          through: {
            model: Composition,
            attributes: ['percentage']
          }
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'Tissu mis à jour avec succès',
      tissu: updatedTissu
    });
  } catch (error) {
    console.error('Error updating tissu:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour du tissu',
      error: error.message
    });
  }
};

// Supprimer un tissu
exports.deleteTissu = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le tissu existe
    const tissu = await Tissu.findByPk(id);
    if (!tissu) {
      return res.status(404).json({
        success: false,
        message: 'Tissu non trouvé'
      });
    }
    
    // Supprimer les compositions associées
    await Composition.destroy({
      where: { tissu_id: id }
    });
    
    // Supprimer le tissu
    await tissu.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Tissu supprimé avec succès'
    });
  } catch (error) {
    console.error('Error deleting tissu:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la suppression du tissu',
      error: error.message
    });
  }
};
