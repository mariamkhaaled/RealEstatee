const Feature = require('../models/featureModel');

exports.getAllFeatures = async (req, res, next) => {
    try {
        const features = await Feature.findAll();

        res.status(200).json({
            status: 'success',
            data: { features }
        });
    } catch (err) {
        next(err);
    }
};