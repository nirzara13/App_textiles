// routes/tissuRoutes.js
import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Contrôleur pour les tissus (définitions de fonctions inline)
const tissuController = {
  getAllTissus: async (req, res) => {
    try {
      const tissus = await db.sequelize.query(
        `SELECT * FROM tissus`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      
      return res.json({
        success: true,
        tissus
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tissus:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des tissus'
      });
    }
  },

  getTissuById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [tissu] = await db.sequelize.query(
        `SELECT * FROM tissus WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!tissu) {
        return res.status(404).json({
          success: false,
          message: 'Tissu non trouvé'
        });
      }
      
      return res.json({
        success: true,
        tissu
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du tissu:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération du tissu'
      });
    }
  },

  getTissusByTextileId: async (req, res) => {
    try {
      const { textileId } = req.params;
      
      const tissus = await db.sequelize.query(
        `SELECT * FROM tissus WHERE textile_id = ?`,
        { 
          replacements: [textileId],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      return res.json({
        success: true,
        tissus
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des tissus par textile_id:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération des tissus'
      });
    }
  },

  createTissu: async (req, res) => {
    try {
      const {
        textile_id,
        name,
        weave_type,
        description,
        image_url,
        recommended_use,
        care_instructions
      } = req.body;
      
      const [result] = await db.sequelize.query(
        `INSERT INTO tissus (textile_id, name, weave_type, description, image_url, recommended_use, care_instructions)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        { 
          replacements: [textile_id, name, weave_type, description, image_url, recommended_use, care_instructions],
          type: db.sequelize.QueryTypes.INSERT 
        }
      );
      
      const tissuId = result;
      
      const [newTissu] = await db.sequelize.query(
        `SELECT * FROM tissus WHERE id = ?`,
        { 
          replacements: [tissuId],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      return res.status(201).json({
        success: true,
        message: 'Tissu créé avec succès',
        tissu: newTissu
      });
    } catch (error) {
      console.error('Erreur lors de la création du tissu:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la création du tissu'
      });
    }
  },

  updateTissu: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        textile_id,
        name,
        weave_type,
        description,
        image_url,
        recommended_use,
        care_instructions
      } = req.body;
      
      await db.sequelize.query(
        `UPDATE tissus 
         SET textile_id = ?, name = ?, weave_type = ?, description = ?, 
             image_url = ?, recommended_use = ?, care_instructions = ?
         WHERE id = ?`,
        { 
          replacements: [textile_id, name, weave_type, description, image_url, 
                         recommended_use, care_instructions, id],
          type: db.sequelize.QueryTypes.UPDATE 
        }
      );
      
      const [updatedTissu] = await db.sequelize.query(
        `SELECT * FROM tissus WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!updatedTissu) {
        return res.status(404).json({
          success: false,
          message: 'Tissu non trouvé'
        });
      }
      
      return res.json({
        success: true,
        message: 'Tissu mis à jour avec succès',
        tissu: updatedTissu
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du tissu:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la mise à jour du tissu'
      });
    }
  },

  deleteTissu: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Vérifier si le tissu existe
      const [tissu] = await db.sequelize.query(
        `SELECT * FROM tissus WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.SELECT 
        }
      );
      
      if (!tissu) {
        return res.status(404).json({
          success: false,
          message: 'Tissu non trouvé'
        });
      }
      
      // Supprimer d'abord les compositions associées
      await db.sequelize.query(
        `DELETE FROM compositions WHERE tissu_id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.DELETE 
        }
      );
      
      // Supprimer le tissu
      await db.sequelize.query(
        `DELETE FROM tissus WHERE id = ?`,
        { 
          replacements: [id],
          type: db.sequelize.QueryTypes.DELETE 
        }
      );
      
      return res.json({
        success: true,
        message: 'Tissu supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du tissu:', error);
      return res.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la suppression du tissu'
      });
    }
  }
};

// Middleware d'authentification et d'administration (versions simples)
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    // Ici, vous devriez vérifier le token JWT et extraire l'ID utilisateur
    // Pour l'exemple, nous allons juste simuler un utilisateur authentifié
    req.userId = 1;
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentification échouée'
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    // Vérifiez si l'utilisateur est un administrateur
    // Pour l'exemple, nous allons juste simuler un contrôle d'administrateur
    const isAdmin = true; // Simuler qu'il s'agit d'un administrateur
    
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé. Vous devez être administrateur.'
      });
    }
    
    next();
  } catch (error) {
    console.error('Erreur de vérification d\'admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des droits d\'administration'
    });
  }
};

// Routes publiques
router.get('/', tissuController.getAllTissus);
router.get('/textile/:textileId', tissuController.getTissusByTextileId);  // Put this BEFORE the generic /:id route
router.get('/:id', tissuController.getTissuById);




// Routes protégées (admin uniquement)
router.post('/', [authMiddleware, adminMiddleware], tissuController.createTissu);
router.put('/:id', [authMiddleware, adminMiddleware], tissuController.updateTissu);
router.delete('/:id', [authMiddleware, adminMiddleware], tissuController.deleteTissu);

export default router;