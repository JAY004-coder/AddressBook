const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('AddressBook', 'root', '', {
  host: "localhost",
  dialect: "mysql",
  operatorsAliases: 0,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users_model")(sequelize, Sequelize);
db.address = require("./address_model")(sequelize,Sequelize);
Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
      db[modelName].associate(db);
  }
});
module.exports = db