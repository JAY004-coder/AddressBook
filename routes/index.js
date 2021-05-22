var users = require("./users");
var address = require("./address");
module.exports = app=>{
  app.use('/', users);
  app.use('/',address)
};
