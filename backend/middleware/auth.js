
// middleware/auth.js
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier que l'utilisateur existe et a le bon rôle
    const user = await db.User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    req.userId = decoded.userId;
    req.userRole = user.role; // Ajouter le rôle à la requête
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

export default authMiddleware;