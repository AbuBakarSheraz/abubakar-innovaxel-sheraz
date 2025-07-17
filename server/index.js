const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;
const connectDB = require('./config/db')
const urlRoutes = require('./routes/urlRoutes');
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api',urlRoutes);



app.listen(PORT,()=>{
    console.log(`urlShortener Service is running on port ${PORT}`);
    
});