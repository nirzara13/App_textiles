import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import bcrypt from 'bcrypt';

const { User } = models;

// Durée de validité du token : 24 heures
const TOKEN_DURATION = '30m';

class AuthController {
  // Inscription
  async signup(req, res) {
    try {
      const { email, password } = req.body;

      // Vérifications de base
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email et mot de passe sont requis'
        });
      }

      // Vérifier si l'email existe déjà
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }

      // Créer l'utilisateur
      const user = await User.create({
        email,
        password // Le hash est géré par le hook beforeCreate dans le modèle
      });

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_DURATION }
      );

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription'
      });
    }
  }

  

  // Connexion

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      
      // Vérifier si l'utilisateur existe
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
  
      // Vérification du mot de passe
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }
  
      // Générer le token AVEC le rôle
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email,
          role: user.role  // Inclure le rôle ici
        },
        process.env.JWT_SECRET,
        { expiresIn: TOKEN_DURATION }
      );

      const refreshToken = jwt.sign(
        { 
          userId: user.id,
          email: user.email
        },
        process.env.JWT_SECRET, // Utilisez votre clé JWT existante
        { expiresIn: '2d' } // Valide pendant 7 jours
      );
  
       // Mettre à jour l'utilisateur avec le refresh token
    await user.update({ refreshToken });

    res.json({
      success: true,
      message: 'Connexion réussie',
      token,
      refreshToken, // Renvoyer le refresh token
      user: {
        id: user.id,
        email: user.email,
        role: user.role  // Renvoyer le rôle
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
}

// Ajouter cette nouvelle méthode pour le refresh token
async refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token requis'
      });
    }

    // Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Trouver l'utilisateur avec ce refresh token
    const user = await User.findOne({ 
      where: { 
        id: decoded.userId, 
        refreshToken: refreshToken 
      } 
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Refresh token invalide'
      });
    }

    // Générer un nouveau token principal
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_DURATION }
    );

    res.json({
      success: true,
      token: newToken
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: 'Token invalide'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Token expiré'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement du token'
    });
  }
}

  // Récupérer le profil de l'utilisateur
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: { exclude: ['password'] } // Exclure le mot de passe
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        user
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil'
      });
    }
  }

  // Mettre à jour le profil
  async updateProfile(req, res) {
    try {
      const { email, password } = req.body;
      const userId = req.userId;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      // Vérifier si le nouvel email est déjà pris
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
      }

      // Préparer les données de mise à jour
      const updateData = {};
      if (email) updateData.email = email;
      
      // Mettre à jour le mot de passe si fourni
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // Mettre à jour l'utilisateur
      await user.update(updateData);

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        user: {
          id: user.id,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil'
      });
    }
  }

  // Récupérer les favoris
  async getFavorites(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findByPk(userId, {
        include: [{
          model: models.Textile,
          as: 'favoritedTextiles',
          through: { attributes: [] },
          include: [{
            model: models.Category,
            attributes: ['name']
          }]
        }]
      });

      if (!user || !user.favoritedTextiles) {
        return res.json({
          success: true,
          favorites: []
        });
      }

      res.json({
        success: true,
        favorites: user.favoritedTextiles
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des favoris'
      });
    }
  }

  // Ajouter un favori
  async addFavorite(req, res) {
    try {
      const userId = req.userId;
      const { textileId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      await user.addFavoritedTextile(textileId);

      res.json({
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
  }

  // Retirer un favori
  async removeFavorite(req, res) {
    try {
      const userId = req.userId;
      const { textileId } = req.params;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      await user.removeFavoritedTextile(textileId);

      res.json({
        success: true,
        message: 'Favori retiré avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du retrait du favori:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du retrait du favori'
      });
    }
  }

  

  // Supprimer le compte
  async deleteAccount(req, res) {
    try {
      const userId = req.userId;
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      await user.destroy();

      res.json({
        success: true,
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du compte'
      });
    }
  }

  async updateFavoriteDetails(req, res) {
    try {
      const userId = req.userId;
      const textileId = req.params.textileId;
      const { usage_context, frequency_of_use, personal_notes } = req.body;
      
      // Trouver le favori correspondant
      const favorite = await models.Favorite.findOne({
        where: {
          user_id: userId,
          textile_id: textileId
        }
      });
      
      if (!favorite) {
        return res.status(404).json({
          success: false,
          message: 'Favori non trouvé'
        });
      }
      
      // Mettre à jour les détails
      await favorite.update({
        usage_context,
        frequency_of_use,
        personal_notes,
        updated_at: new Date()
      });
      
      res.json({
        success: true,
        message: 'Détails du favori mis à jour avec succès',
        favorite
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails du favori:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour des détails'
      });
    }
  }


  // Dans le même fichier authController.js
async createFirstAdmin(req, res) {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ 
      where: { role: 'admin' } 
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        message: 'Un admin existe déjà' 
      });
    }

    // Créer le premier admin
    const user = await User.create({
      email: 'admin@votre-site.com',
      password: 'AdminTempPass2024!',
      role: 'admin'
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_DURATION }
    );

    res.status(201).json({ 
      success: true,
      message: 'Premier compte admin créé',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la création du compte admin',
      error: error.message 
    });
  }
}




}










export default new AuthController();