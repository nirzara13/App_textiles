// controllers/profileController.js
export const getProfileDetails = async (req, res) => {
    try {
      // Chercher le profil, avec création lazy si non existant
      let profile = await db.Profile.findOne({
        where: { user_id: req.userId }
      });
      
      if (!profile) {
        // Créer un profil vide si l'utilisateur n'en a pas encore
        profile = await db.Profile.create({
          user_id: req.userId,
          display_name: '',
          bio: ''
        });
      }
      
      res.json({
        success: true,
        profile
      });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  };
  
  export const updateProfileDetails = async (req, res) => {
    try {
      const { display_name, bio } = req.body;
      
      let profile = await db.Profile.findOne({
        where: { user_id: req.userId }
      });
      
      if (profile) {
        // Mettre à jour le profil existant
        await profile.update({
          display_name,
          bio
        });
      } else {
        // Créer un nouveau profil
        profile = await db.Profile.create({
          user_id: req.userId,
          display_name,
          bio
        });
      }
      
      res.json({
        success: true,
        message: 'Profil mis à jour',
        profile
      });
    } catch (error) {
      console.error('Erreur:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur'
      });
    }
  };