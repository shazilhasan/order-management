var express = require('express');
var _ = require('lodash');
var router = express.Router();
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/orders');
mongoose.connect('mongodb://portaltechnologics-server:frHFtTzsDnXiePXeRp6lNL4f3omNUpUpuk0zKom08myfeLiRJQIxxJEuad0eRagX9nThg0sB1tIxACDbME0weA==@portaltechnologics-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@portaltechnologics-server@');
mongoose.Promise = global.Promise;

var Order = mongoose.model('Order',
    {
        name: String,
        type: String,
        size: String,
        price: Number,
        quantity: Number,
        amount: Number,
        time: Date
    });
var Drink = mongoose.model('Drink',
    {
        type: String,
        name: String,
        size: String,
        price: Number
    });

router.get('/drink', function (req, res, next) {
    Drink.find(function (err, drinks) {
        if (err) {
            console.log(err);
            res.status(500).send({success: false, message: err});
        } else {
            res.send(drinks);
        }
    });
});

router.get('/order', function (req, res, next) {
    Order.find(function (err, orders) {
        if (err) {
            console.log(err);
            res.send({success: false, message: err});
        } else {
            res.send(orders);
        }
    });
});

router.put('/order', function (req, res, next) {
    var newOrder = new Order(req.body);
    newOrder.time = new Date();
    newOrder.save(function (err) {
        if (err) {
            console.log(err);
            res.status(500).send({success: false, message: err});
        } else {
            res.send({success: true});
        }
    });
});
module.exports = router;
