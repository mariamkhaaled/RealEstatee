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

        // 1. Parse the listing object from the request
        const parsedListing = typeof req.body.listing === "string"
            ? JSON.parse(req.body.listing)
            : (req.body.listing || {});

        // 2. FORCE the status to 'Pending' so it overrides the database default
        parsedListing.status = 'Pending';

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

            // 3. Assign the updated listing object containing the Pending status
            listing: parsedListing,

            feature_ids:
                typeof req.body.feature_ids === "string"
                    ? JSON.parse(req.body.feature_ids)
                    : req.body.feature_ids || [],

            images: uploadedImages.length > 0 ? uploadedImages : bodyImages
        };

        const propertyId = await Property.create(parsedData);

        res.status(201).json({
            status: 'success',
            message: 'Property created successfully and is pending admin approval',
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

    exports.updateProperty = async (req, res, next) => {
    try {
        const propertyId = Number(req.params.id);

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

        const updatedProperty = await Property.update(
            propertyId,
            parsedData.owner_id,
            parsedData
        );

        res.status(200).json({
            status: 'success',
            message: 'Property updated successfully',
            data: { property: updatedProperty }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteProperty = async (req, res, next) => {
    try {
        const propertyId = Number(req.params.id);
        const ownerId = Number(req.body.owner_id);

        await Property.delete(propertyId, ownerId);

        res.status(200).json({
            status: 'success',
            message: 'Property deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
const db = require('../config/db'); // Ensure DB is imported at the top of the file if not already

exports.updateListingStatus = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const { status } = req.body;

        await db.execute(
            'UPDATE listings SET status = ? WHERE listing_id = ?',
            [status, listingId]
        );

        res.status(200).json({ 
            status: 'success', 
            message: `Property status updated to ${status}` 
        });
    } catch (err) {
        next(err);
    }
};
