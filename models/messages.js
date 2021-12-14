

module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

Messages.associate = (models) => {
    Messages.belongsTo(models.User, {
        foreignKey: {
            allowNull: false
        }
    })
}

    return Messages;
}