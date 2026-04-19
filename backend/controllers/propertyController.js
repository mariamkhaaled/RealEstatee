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
        const uploadedImages = (req.files || []).map(
            (file) => `/uploads/${file.filename}`
        );

        const bodyImages = Array.isArray(req.body.images)
            ? req.body.images
            : req.body.images
            ? JSON.parse(req.body.images)
            : [];

        const parsedData = {
            owner_id: Number(req.body.owner_id),

            property:
                typeof req.body.property === "string"
                    ? JSON.parse(req.body.property)
                    : req.body.property,

            location:
                typeof req.body.location === "string"
                    ? JSON.parse(req.body.location)
                    : req.body.location,

            listing:
                typeof req.body.listing === "string"
                    ? JSON.parse(req.body.listing)
                    : req.body.listing,

            feature_ids:
                typeof req.body.feature_ids === "string"
                    ? JSON.parse(req.body.feature_ids)
                    : req.body.feature_ids || [],

            images: uploadedImages.length > 0 ? uploadedImages : bodyImages
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

exports.getOwnerProperties = async (req, res, next) => {
    try {
        const ownerId = Number(req.params.ownerId);

        const properties = await Property.findByOwnerId(ownerId);

        res.status(200).json({
            status: 'success',
            data: { properties }
        });
    } catch (err) {
        next(err);
    }
};
exports.getPropertyById = async (req, res, next) => {
    try {
        const propertyId = Number(req.params.id);
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                status: 'fail',
                message: 'Property not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: { property }
        });
    } catch (err) {
        next(err);
    }
};