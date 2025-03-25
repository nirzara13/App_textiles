

// // models/textile.js
// export default (sequelize, DataTypes) => {
//   const Textile = sequelize.define('Textile', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     category_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true
//     },
//     // Nouvelle colonne ajoutée pour les URLs des images
//     image_url: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     }
//   }, {
//     tableName: 'textiles',
//     timestamps: false
//   });

//   Textile.associate = (models) => {
//     // Relations existantes
//     Textile.belongsTo(models.Category, {
//       foreignKey: 'category_id',
//       as: 'category'
//     });
    
//     Textile.belongsToMany(models.User, {
//       through: models.Favorite,
//       foreignKey: 'textile_id',
//       otherKey: 'user_id',
//       as: 'users'
//     });
    
//     Textile.hasOne(models.TextileCharacteristics, {
//       foreignKey: 'textile_id',
//       as: 'characteristics'
//     });
    
//     // Relation 1:N avec Tissu
//     Textile.hasMany(models.Tissu, {
//       foreignKey: 'textile_id',
//       as: 'tissus'
//     });
    
//     // Relation N:N avec Tissu via Composition - CORRECTION ICI
//     if (models.Composition) {  // Vérifier que le modèle existe
//       Textile.belongsToMany(models.Tissu, {
//         through: models.Composition,  // Spécification explicite de la table de jointure
//         foreignKey: 'textile_id',
//         otherKey: 'tissu_id',
//         as: 'composedTissus'
//       });
//     } else {
//       console.warn('Le modèle Composition n\'est pas disponible - la relation N:N Textile-Tissu n\'a pas été établie');
//     }
//   };

//   return Textile;
// };



// Pour textile.js
export default (sequelize, DataTypes) => {
  const Textile = sequelize.define('Textile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'textiles',
    timestamps: false
  });

  Textile.associate = (models) => {
    // Relations essentielles
    Textile.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
      
    Textile.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'textile_id',
      otherKey: 'user_id',
      as: 'users'
    });
      
    // Relations avec Tissu si vous les utilisez réellement dans votre application
    // Sinon, vous pouvez simplement les supprimer
    try {
      Textile.hasMany(models.Tissu, {
        foreignKey: 'textile_id',
        as: 'tissus'
      });
      
      // Relation N:N avec Tissu via Composition si réellement utilisée
      Textile.belongsToMany(models.Tissu, {
        through: models.Composition,
        foreignKey: 'textile_id',
        otherKey: 'tissu_id',
        as: 'composedTissus'
      });
    } catch (error) {
      // Silencieux - pas d'avertissement affiché
    }
  };

  return Textile;
};
