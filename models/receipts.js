const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Receipt = new Schema ({
    date: { type: String, required: true },
    company: { type: String, required: true },
    total: { type: String, required: true },
    owner: { type: String, required: true },
    photo: { type: String, required: false },
    ids: { type: Array, required: false },
    products: { type: Array, required: false },
    prices: { type: Array, required: false },
    quantities: { type: Array, required: false }
});
module.exports = mongoose.model('Receipt', Receipt)