// // models/favorite.js
// const Favorite = (sequelize, DataTypes) => {
//   const Favorite = sequelize.define('Favorite', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     textile_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'textiles',
//         key: 'id'
//       }
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW
//     }
//   }, {
//     tableName: 'favorites',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: false
//   });

//   Favorite.associate = (models) => {
//     Favorite.belongsTo(models.User, {
//       foreignKey: 'user_id'
//     });
//     Favorite.belongsTo(models.Textile, {
//       foreignKey: 'textile_id'
//     });
//   };

//   return Favorite;
// };

// export default Favorite;




// models/favorite.js
// models/favorite.js
export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    textile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'textiles',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    updated_at: {  // Ajout de cette colonne
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    }
  }, {
    tableName: 'favorites',
    timestamps: false  // Gardez ceci à false car nous définissons manuellement les colonnes
  });

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    Favorite.belongsTo(models.Textile, {
      foreignKey: 'textile_id',
      as: 'textile'
    });
  };

  return Favorite;
};