var sql = require("../models");
var jwt = require('jsonwebtoken');
async function Authentication(req, res, next) {
    try {
        if (req.headers.authorization) {
            var auth = req.headers.authorization.toString().split(" ");
            var decoded = jwt.verify(auth[1], process.env.privatekey);
            if (decoded.identify == "login user") {
                var user_id = await sql.users.findOne({ where: { user_id: decoded.user_id, is_logout: 0 } })
                if (user_id) {
                    next();
                } else {
                    res.json({ "res": 0, "message": "Token has been expire." });
                }
            } else {
                res.json({ "res": 0, "message": "Invalid Auth." });
            }
        } else {
            res.json({ "res": 0, "message": "Please provide Authenciation information." });
        }
    } catch (e) {
        res.json({ "res": 0, "message": "Please provide Authenciation information." });
    }

}
module.exports = Authentication;