module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        room: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

User.associate = (models) => {
    User.hasMany(models.Messages, {
        foreignKey: {
            onDelete: "cascade"
        }
    })
}

    return User;
};


