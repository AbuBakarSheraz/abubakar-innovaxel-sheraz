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
        updatedAt: newUrl.updatedAt.toISOString()        
    });
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }
    
};


exports.getUrl = async(req, res) => {
    const shortCode = req.params.shortCode;
    try{
        if(shortCode)
        {
            const results = await URL.findOneAndUpdate(
                {
                    shortCode
                },
                {
                    $inc:{accessCount : 1}
                },
            );
            console.log(results);
            
            if(results){
            return res.status(200).json({
                id: results._id,
                url: results.url,
                shortCode: results.shortCode,
                createdAt: results.createdAt.toISOString(),
                updatedAt: results.updatedAt.toISOString()                 
            });
            }else{
                return res.status(404).json({error : "Url not found"});
            }
    
        }else{
            res.status(400).json({error: "Valid short URL is required"})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }

};

exports.updateUrl = async(req, res) => {
    const shortCode = req.params.shortCode;
    const url = req.body.url;
    if(!url || !shortCode || typeof url !== 'string' || typeof shortCode !== 'string'){
        return res.status(400).json({error : 'Valid short URL or Original URL is required'});
    }

    try{
        const results = await URL.findOneAndUpdate(
            {shortCode},
            {
                url: url,
                updatedAt: new Date(),
            },
        );
        if(!results){
            return res.status(404).json({error : 'URL not Found'});
        }
        return res.status(200).json({
            id: results._id,
            url: results.url,
            shortCode: results.shortCode,
            createdAt: results.createdAt.toISOString(),
            updatedAt: new Date().toISOString()                             
        })
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }
};

exports.deleteUrl = async(req, res) => {
    const shortCode = req.params.shortCode;
    if(!shortCode || typeof shortCode !== 'string'){
        return res.status(400).json({error : 'Valid short URL is required'});
    }
    try{
        const results = await URL.findOneAndDelete({shortCode});
        if(!results)
        {
            return res.status(404).json({error : "URL was not found."});
        }

        return res.sendStatus(204); 

    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }
};

exports.statsOfUrl = async(req, res) => {
    const shortCode = req.params.shortCode;
    if(!shortCode || typeof shortCode !== 'string')
    {
        return res.status(400).json({error : "Invalid type or URL is not provided"});
    }

    try{
        const results = await URL.findOne({shortCode});
        if(!results)
        {
            return res.status(404).json({error : "URl was not found"});
        }

        return res.status(200).json({
            id: results._id,
            url: results.url,
            shortCode: results.shortCode,
            createdAt: results.createdAt,
            updatedAt: results.updatedAt,
            accessCount: results.accessCount
        });
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }
    ;
}


