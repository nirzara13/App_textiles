// controllers/categoryController.js
import db from '../models/index.js';

const Category = db.Category;
const Textile = db.Textile;

// Récupérer toutes les catégories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    
    res.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des catégories'
    });
  }
};

// Récupérer une catégorie par son ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{
        model: Textile,
        as: 'textiles'
      }]
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la catégorie'
    });
  }
};

// Créer une nouvelle catégorie
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Vérifier si la catégorie existe déjà
    const existingCategory = await Category.findOne({ where: { name } });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom existe déjà'
      });
    }
    
    // Créer la catégorie
    const newCategory = await Category.create({
      name
    });
    
    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: newCategory
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la catégorie'
    });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    
    // Vérifier si la catégorie existe
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }
    
    // Vérifier si le nouveau nom existe déjà pour une autre catégorie
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ where: { name } });
      
      if (existingCategory && existingCategory.id !== parseInt(id)) {
        return res.status(400).json({
          success: false,
          message: 'Une catégorie avec ce nom existe déjà'
        });
      }
    }
    
    // Mettre à jour la catégorie
    await category.update({ name });
    
    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: category
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour de la catégorie'
    });
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si la catégorie existe
    const category = await Category.findByPk(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }
    
    // Vérifier si des textiles utilisent cette catégorie
    const textilesCount = await Textile.count({ where: { category_id: id } });
    
    if (textilesCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer cette catégorie car elle est utilisée par des textiles'
      });
    }
    
    // Supprimer la catégorie
    await category.destroy();
    
    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de la catégorie'
    });
  }
};