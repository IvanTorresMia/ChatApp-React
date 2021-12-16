module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("Message", {
        text: {
            type: DataTypes.STRING,
            allownull: false
        },
        username: {
            type: DataTypes.STRING,
            allownull: false
        },
        timeSubmited: {
            type: DataTypes.DATE,
            allownull: false
        }
    });


    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            onDelete: "cascade"
        })
    }


    return Message;
}