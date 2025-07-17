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
                updatedAt: results.createdAt.toISOString()                 
            });
            }else{
                return res.status(404).json({error : "Url not found"});
            }
    
        }else{
            res.status(400).json({error: "Valide shortCode is required"})
        }
    }catch(error){
        console.error(error);
        res.status(500).json({error : "Internal Server Error"});
    }

};


