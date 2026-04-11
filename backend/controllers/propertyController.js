const Property = require('../models/propertyModel');

exports.getAllProperties = async (req, res, next) => {
    try {
        const properties = await Property.findAll();
        res.status(200).json({
            status: 'success',
            data: { properties }
        });
    } catch (err) {
        next(err);
    }
};

exports.createProperty = async (req, res, next) => {
    try {
        const propertyId = await Property.create(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Property created!',
            id: propertyId
        });
    } catch (err) {
        next(err);
    }
};