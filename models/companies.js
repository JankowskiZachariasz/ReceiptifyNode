const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Company = new Schema ({
    name: { type: String, required: true },
    company: { type: String, required: true },
    owner: { type: String, required: true },
    status: { type: String, required: true },
});
module.exports = mongoose.model('Company', Company)