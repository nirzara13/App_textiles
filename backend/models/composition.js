// models/Composition.js
export default (sequelize, DataTypes) => {
    const Composition = sequelize.define('Composition', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tissu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tissus',
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
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100
        }
      }
    }, {
      tableName: 'compositions',
      timestamps: true,
      underscored: true
    });
  
    Composition.associate = (models) => {
      // Les associations sont définies dans les modèles Tissu et Textile
    };
  
    return Composition;
  };