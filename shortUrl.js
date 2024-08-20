const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: {type: String, unique: true},
    date: { type: String, default: Date.now }
});
module.exports = mongoose.model('ShorterUrl', urlSchema);
