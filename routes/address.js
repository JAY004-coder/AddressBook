var express = require('express');
var router = express.Router();
var authentication = require("./authentication");
var sqldb = require("../models");

// Add/Update Address
// ***********************************
// localhost:8080/AddAddress
// {
//     "user_id":2,
//     "data":[{
//     "address_id":3,
//     "title": "ABCa",
//     "addressLine1": "Sagrampura",
//     "addressLine2": "Surat",
//     "country": "India",
//     "state": "Gujrat",
//     "city": "Surat",
//     "pincode": "395002"
// },{
//     "address_id":0,
//     "title": "a",
//     "addressLine1": "valod",
//     "addressLine2": "Bardoli",
//     "country": "India",
//     "state": "Gujrat",
//     "city": "Surat",
//     "pincode": "394905"
// }]
// }
// ***********************************
router.put('/AddAddress', authentication, async (req, res, next) => {
    try {
        try {
            if (!req.body.user_id) {
                res.json({ "status": 0, "message": "Please enter user id" });
            } else {
                var new_address = [], address_ids = [], update = 0;
                var item_comment_global_text_selected_options_update = "update address set ",
                    add1 = "case address_id ",
                    add2 = "case address_id ",
                    add3 = "case address_id ",
                    add4 = "case address_id ",
                    add5 = "case address_id ",
                    add6 = "case address_id ";
                add7 = "case address_id ";
                req.body.data.forEach(element => {
                    if (element.address_id == 0) {
                        new_address.push({
                            user_id: req.body.user_id,
                            title: element.title,
                            addressLine1: element.addressLine1,
                            addressLine2: element.addressLine2,
                            country: element.country,
                            state: element.state,
                            city: element.city,
                            pincode: element.pincode
                        })
                    } else {
                        update = 1
                        address_ids.push(element.address_id)
                        add1 += " when " + element.address_id + " then '" + element.title + "'";
                        add2 += " when " + element.address_id + " then '" + element.addressLine1 + "'";
                        add3 += " when " + element.address_id + " then '" + element.addressLine2 + "'";
                        add4 += " when " + element.address_id + " then '" + element.country + "'";
                        add5 += " when " + element.address_id + " then '" + element.state + "'";
                        add6 += " when " + element.address_id + " then '" + element.city + "'";
                        add7 += " when " + element.address_id + " then '" + element.pincode + "'";
                    }
                });
                if (update == 1) {
                    add1 += "else title end",
                        add2 += "else addressLine1 end",
                        add3 += "else addressLine2 end ",
                        add4 += "else country end ",
                        add5 += "else state end ",
                        add6 += "else city end ",
                        add7 += "else pincode end ";
                    var update_address = await sqldb.address.update({
                        title: sqldb.sequelize.literal(add1),
                        addressLine1: sqldb.sequelize.literal(add2),
                        addressLine2: sqldb.sequelize.literal(add3),
                        country: sqldb.sequelize.literal(add4),
                        state: sqldb.sequelize.literal(add5),
                        city: sqldb.sequelize.literal(add6),
                        pincode: sqldb.sequelize.literal(add7)
                    }, {
                        where: { address_id: address_ids },
                        returning: true
                    })
                }
                if (new_address.length){
                    var add_new =  await sqldb.address.bulkCreate(new_address)
                }
                res.json({ 'status': 1, 'msg': 'Address has been added or update successfuly.' })
            }
        } catch (e) {
            res.json({ "status": 0, "message": e.message });
        }
    } catch (err) {
        res.json({ 'status': 0, 'msg': err })
    }

});

// Delete Address
// ***********************************
// localhost:8080/DeleteAddress/:address_id
// ***********************************
router.delete('/DeleteAddress/:address_id', authentication, async (req, res, next) => {
    try {
        if (!req.params.address_id) {
            res.json({ "status": 0, "message": "Please enter address id" });
        } else {
            let delete_address = await sqldb.address.update({
                is_deleted: 1
            }, {
                where: { address_id: req.params.address_id },
            });
            res.json({ "status": 1, "message": "Address has been deleted successfully." })
        }
    } catch (e) {
        res.json({ "status": 0, "message": e.message });
    }
});

// Get Address by user id
// ***********************************
// localhost:8080/ViewAddressByUser/:user_id
// ***********************************
router.get('/ViewAddressByUser/:user_id', authentication, async (req, res, next) => {
    try {
        if (!req.params.user_id) {
            res.json({ "status": 0, "message": "Please enter user id" });
        } else {
            let list_user = await sqldb.address.findAll({
                where: { user_id: req.params.user_id, is_deleted: 0 },
            });
            res.json({ "status": 1, "message": "Success", "data": list_user })
        }
    } catch (e) {
        res.json({ "status": 0, "message": e.message });
    }
});
module.exports = router