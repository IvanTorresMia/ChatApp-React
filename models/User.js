

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allownull: false
        },
        room: {
            type: DataTypes.STRING,
            allownull: false
        }
    });


    User.associate = (models) => {
        User.hasMany(models.Message, {
            foreignKey: {
                allownull: false
            }
        })
    }

    return User;

}