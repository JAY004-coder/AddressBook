module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING(100)
        },
        gender: {
            type: Sequelize.STRING(1),
        },
        password: {
            type: Sequelize.STRING(250),
            allowNull: false,
        },
        profile_url:{
            type: Sequelize.STRING(250),
        },
        is_logout:{
            type: Sequelize.INTEGER,
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    users.associate = function (models) {
        users.hasMany(models.address, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
        });
    };
    return users;
};