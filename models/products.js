const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema ({
    name: { type: String, required: true },
    receiptName: { type: String, required: true },
    owner: { type: String, required: true },
    company: { type: String, required: true },
    Pieces_mass: { type: Boolean, required: false },
    fats: { type: String, required: false },
    carbo: { type: String, required: false },
    calories: { type: String, required: false },
});
module.exports = mongoose.model('Product', Product)