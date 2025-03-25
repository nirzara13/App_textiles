// // models/tissu.js
// export default (sequelize, DataTypes) => {
//   const Tissu = sequelize.define('Tissu', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     textile_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'textiles',
//         key: 'id'
//       }
//     },
//     name: {
//       type: DataTypes.STRING(100),
//       allowNull: false
//     },
//     weave_type: {
//       type: DataTypes.ENUM('Sergé', 'Satin', 'Toile', 'Croisé', 'Bouclé'),
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     image_url: {
//       type: DataTypes.STRING(255),
//       allowNull: true
//     },
//     recommended_use: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     care_instructions: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     }
//   }, {
//     tableName: 'tissus',
//     timestamps: true,
//     underscored: true
//   });

//   Tissu.associate = (models) => {
//     // Relation avec Textile
//     Tissu.belongsTo(models.Textile, {
//       foreignKey: 'textile_id',
//       as: 'textile'
//     });

//     // Relation N-N avec Textile via Composition
//     if (models.Composition) {  // Vérifier que le modèle existe
//       Tissu.belongsToMany(models.Textile, {
//         through: models.Composition,  // Spécifier explicitement la table de jointure
//         foreignKey: 'tissu_id',
//         otherKey: 'textile_id',
//         as: 'compositionTextiles'
//       });
//     } else {
//       console.warn('Le modèle Composition n\'est pas disponible - la relation N:N Tissu-Textile n\'a pas été établie');
//     }
//   };

//   return Tissu;
// };








// models/tissu.js
export default (sequelize, DataTypes) => {
  const Tissu = sequelize.define('Tissu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    textile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'textiles',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    weave_type: {
      type: DataTypes.ENUM('Sergé', 'Satin', 'Toile', 'Croisé', 'Bouclé'),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    recommended_use: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    care_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'tissus',
    timestamps: true,
    underscored: true
  });

  Tissu.associate = (models) => {
    // Relation avec Textile
    Tissu.belongsTo(models.Textile, {
      foreignKey: 'textile_id',
      as: 'textile'
    });

    // Relation N-N avec Textile via Composition - dans un try/catch pour éviter les avertissements
    try {
      Tissu.belongsToMany(models.Textile, {
        through: models.Composition,
        foreignKey: 'tissu_id',
        otherKey: 'textile_id',
        as: 'compositionTextiles'
      });
    } catch (error) {
      // Suppression du message d'avertissement pour une présentation plus propre
    }
  };

  return Tissu;
};