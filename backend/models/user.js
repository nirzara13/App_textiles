
//code du 05/04/2025

import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user'
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        last_activity: {  // Déplacé à l'intérieur de l'objet des attributs
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });

    User.associate = (models) => {
        User.belongsToMany(models.Textile, {
            through: models.Favorite,
            foreignKey: 'user_id',
            otherKey: 'textile_id',
            as: 'favoritedTextiles'
        });
    };

    return User;
};