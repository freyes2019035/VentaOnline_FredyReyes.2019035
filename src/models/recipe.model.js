const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeModel = Schema({
    emision_date: Date,
    user: {type: Schema.Types.ObjectId, ref: 'users'},
    purchase: [{
        product: {type: Schema.Types.ObjectId, ref: 'products'},
        quantity: String,
        subTotal: String,
    }],
    total: Number,
});

module.exports = mongoose.model('recipes', recipeModel)