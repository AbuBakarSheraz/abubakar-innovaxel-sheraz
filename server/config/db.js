const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/url-shortener');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error while connecting to MongoDB:', error.message);
    }
};

module.exports = connectDB;
