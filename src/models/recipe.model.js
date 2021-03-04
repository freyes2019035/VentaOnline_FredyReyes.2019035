const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeModel = Schema({
    emision_date: Date,
    user: {type: Schema.Types.ObjectId},
    purchase: Object,
    total: Number,
});

module.exports = mongoose.model('recipes', recipeModel)