var mysql = require('./mysql');
var util = require('util');

module.exports = {
    connection: null,
    // Create a database connection
    connectDB: function () {
        var connectionConfig = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'pizzadb'
        };
        connection = mysql.createConnection(connectionConfig);
        util.log('connection::connecting...');
        connection.connect(function (err) {
            util.log('connection::connected');
            util.log('A Simple Node Server is Running... ');
        });
    },

    getNumberOfOrderedPizzas: function (sid, callback) {
        connection.query(
            "SELECT SUM(PizzaQuantity) as total FROM PizzaOrder WHERE UserID = ?",
            sid,
            function (err, rows, fields) {
                if (err)
                    throw err;

                var total = rows.pop().total;
                callback(total);
            }
        );
    },

    orderExists: function (pizzaOrder, callback) {
        connection.query(
            "SELECT EXISTS(SELECT 1 FROM PizzaOrder " +
            "WHERE UserID = ? AND PizzaSize = ? AND PizzaKind = ? AND ExtraCheese = ?) as `exists`",
            [
                pizzaOrder.sid, pizzaOrder.size, pizzaOrder.kind, pizzaOrder.extra_cheese
            ],
            function (err, result) {
                if (err) throw  err;
                callback(result.pop().exists);
            }
        );
    },

    removeOrderEntry: function (pizzaOrder, callback) {
        connection.query(
            "UPDATE PizzaOrder SET PizzaQuantity = PizzaQuantity - 1 " +
            "WHERE UserID = ? AND PizzaSize = ? AND PizzaKind = ? AND ExtraCheese = ?",
            [
                pizzaOrder.sid, pizzaOrder.size, pizzaOrder.kind, pizzaOrder.extra_cheese
            ],
            function (err, result) {
                if (err) throw  err;

                connection.query(
                    "DELETE FROM PizzaOrder WHERE PizzaQuantity = ?",
                    0,
                    function (err, result) {
                        if (err) throw  err;
                    }
                );

                callback();
            }
        );
    },

    updatePizzaOrder: function (pizzaOrder, callback) {
        connection.query(
            "UPDATE PizzaOrder SET PizzaQuantity = PizzaQuantity + ? " +
            "WHERE UserID = ? AND PizzaSize = ? AND PizzaKind = ? AND ExtraCheese = ?",
            [
                pizzaOrder.quantity, pizzaOrder.sid, pizzaOrder.size,
                pizzaOrder.kind, pizzaOrder.extra_cheese
            ],
            function (err, result) {
                if (err) throw  err;
                callback(result.affectedRows)
            }
        );
    },

    addPizzaOrder: function (pizzaOrder, callback) {
        connection.query(
            "INSERT INTO PizzaOrder VALUES (?, ?, ?, ?, ?)",
            [
                pizzaOrder.sid, pizzaOrder.size, pizzaOrder.kind,
                pizzaOrder.quantity, pizzaOrder.extra_cheese
            ],
            function (err, results) {
                if (err)
                    throw  err;
                callback(results.affectedRows);
            }
        );
    },

    getMyCart: function (sid, callback) {
        connection.query(
            "SELECT * FROM PizzaOrder WHERE UserID = ?",
            sid,
            function (err, results) {
                if (err) throw err;
                var cart = [];
                results.forEach(function (row) {
                    var order = {
                        size: row.PizzaSize,
                        kind: row.PizzaKind,
                        quantity: row.PizzaQuantity,
                        extra_cheese: row.ExtraCheese
                    };
                    cart.push(order);
                });
                callback(cart);
            }
        );
    },

    emptyCart: function (sid, callback) {
        connection.query(
            "DELETE FROM PizzaOrder WHERE UserID = ?",
            sid,
            function (err, result) {
                if (err) throw  err;
                callback();
            }
        );
    }
};