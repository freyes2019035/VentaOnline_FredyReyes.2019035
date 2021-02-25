const mongoose = require('mongoose');

let schema = mongoose.Schema;

let userSchema = schema({
    name: String,
    email: String,
    userName: String,
    password: String,
    rol: String,
    cart: [{
        product: {type: schema.Types.ObjectId, ref: 'products'},
        quantity: String,
        subTotal: String,
    }],
});

module.exports = mongoose.model('users', userSchema)