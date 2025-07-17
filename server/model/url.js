const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true
        },
        shortCode: {
            type: String,
            required: true,
            unique:true
        },
        accessCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    },

);

module.exports = mongoose.model('Url', urlSchema);