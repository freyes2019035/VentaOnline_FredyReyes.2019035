const mongoose = require('mongoose');

let schema = mongoose.Schema;

let productSchema = schema({
    name: String,
    price: Number,
    quantity: Number,
    category: {type: schema.Types.ObjectId, ref: 'categories'}
});

module.exports = mongoose.model('products', productSchema)