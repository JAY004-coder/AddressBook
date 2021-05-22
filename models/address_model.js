module.exports = (sequelize, Sequelize) => {
    const address = sequelize.define("address",{
        address_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING(100)
        },
        addressLine1: {
            type: Sequelize.STRING(256)
        },
        addressLine2: {
            type: Sequelize.STRING(256)
        },
        country:{
            type: Sequelize.STRING(50)
        },
        state:{
            type: Sequelize.STRING(50)
        },
        city:{
            type: Sequelize.STRING(50)
        },
        pincode:{
            type: Sequelize.STRING(10)
        },
        is_deleted:
        {
            type: Sequelize.INTEGER
        },
    }, {
        freezeTableName: true,
        timestamps: false
    });
    address.associate = function (models) {
        address.belongsTo(models.users, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
        });
    };
    return address;
}