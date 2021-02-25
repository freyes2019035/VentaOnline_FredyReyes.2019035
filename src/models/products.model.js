const mongoose = require('mongoose');

let schema = mongoose.Schema;

let productSchema = schema({
    name: String,
    quantity: Number,
});

module.exports = mongoose.model('products', productSchema)