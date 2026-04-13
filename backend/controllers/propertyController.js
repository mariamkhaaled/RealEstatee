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
        const imagePaths = (req.files || []).map(
            (file) => `/uploads/${file.filename}`
        );

        const parsedData = {
            owner_id: Number(req.body.owner_id),
            property: JSON.parse(req.body.property),
            location: JSON.parse(req.body.location),
            listing: JSON.parse(req.body.listing),
            feature_ids: req.body.feature_ids
                ? JSON.parse(req.body.feature_ids)
                : [],
            images: imagePaths
        };

        const propertyId = await Property.create(parsedData);

        res.status(201).json({
            status: 'success',
            message: 'Property created successfully',
            propertyId
        });
    } catch (err) {
        next(err);
    }
};