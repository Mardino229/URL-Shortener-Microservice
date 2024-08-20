const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    urlCode: String,
    date: { type: String, default: Date.now }
});

module.exports = urlSchema
