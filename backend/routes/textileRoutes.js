// routes/textileRoutes.js
import express from 'express';
import { 
  getAllTextiles, 
  getTextileById, 
  getTextileWithCharacteristics,
  getTextileWithTissus,
  getCompleteTextileInfo,
  createTextile,
  updateTextile,
  deleteTextile
} from '../controllers/textileController.js';





const router = express.Router();

// Routes publiques pour les textiles
router.get('/', getAllTextiles);
router.get('/:id', getTextileById);
router.get('/:id/characteristics', getTextileWithCharacteristics);
router.get('/:id/tissus', getTextileWithTissus);
router.get('/:id/details', getCompleteTextileInfo);


export default router;