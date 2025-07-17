const shortid = require('shortid');
const URL = require('../model/url');

exports.createUrl = async(req, res) => {
    try{
    const { url } = req.body;
    if(!url || typeof url !== 'string') {
        
        return res.status(400).json({error : "Valid Url is required"});
    }

    const shortCode = shortid.generate();
    const newUrl = await URL.create({
        url,
        shortCode,
        createdAt: new Date(),
        updatedAt: new Date(),
        accessCount: 0
    });

    return res.status(201).json({
        id: newUrl._id,
        url: newUrl.url,
        shortCode: newUrl.shortCode,
        createdAt: newUrl.createdAt.toISOString(),
        updatedAt: newUrl.createdAt.toISOString()        
    });
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }
    
};

