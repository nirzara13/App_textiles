
// controllers/compositionController.js
const { Composition, Tissu, Textile } = require('../models');

// Récupérer toutes les compositions
exports.getAllCompositions = async (req, res) => {
  try {
    const compositions = await Composition.findAll({
      include: [
        {
          model: Tissu,
          as: 'tissu',
          attributes: ['id', 'name', 'weave_type']
        },
        {
          model: Textile,
          as: 'textile',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      count: compositions.length,
      compositions
    });
  } catch (error) {
    console.error('Error getting compositions:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des compositions'
    });
  }
};

// Récupérer les compositions d'un tissu spécifique
exports.getCompositionsByTissuId = async (req, res) => {
  try {
    const { tissuId } = req.params;
    
    const compositions = await Composition.findAll({
      where: { tissu_id: tissuId },
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
      count: compositions.length,
      compositions
    });
  } catch (error) {
    console.error('Error getting compositions by tissu ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Une erreur est survenue lors de la récupération des compositions'
    });
  }
};