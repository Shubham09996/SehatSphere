import asyncHandler from 'express-async-handler';
import Medicine from '../models/Medicine.js';

// @desc    Search for medicines
// @route   GET /api/medicines?keyword=<keyword>
// @access  Public
const searchMedicines = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        $or: [
            { brandName: { $regex: req.query.keyword, $options: 'i' } },
            { genericName: { $regex: req.query.keyword, $options: 'i' } },
            { manufacturer: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
        ],
    } : {};

    const medicines = await Medicine.find({ ...keyword });
    res.json(medicines);
});

// @desc    Get single medicine by ID
// @route   GET /api/medicines/:id
// @access  Public
const getMedicineById = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
        res.json(medicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Admin
const createMedicine = asyncHandler(async (req, res) => {
    const { brandName, genericName, strength, type, manufacturer, description, usage, sideEffects, precautions, category, price, image } = req.body;

    const medicine = new Medicine({
        brandName,
        genericName,
        strength,
        type,
        manufacturer,
        description,
        usage,
        sideEffects,
        precautions,
        category,
        price,
        image,
    });

    const createdMedicine = await medicine.save();
    res.status(201).json(createdMedicine);
});

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Admin
const updateMedicine = asyncHandler(async (req, res) => {
    const { brandName, genericName, strength, type, manufacturer, description, usage, sideEffects, precautions, category, price, image } = req.body;

    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
        medicine.brandName = brandName || medicine.brandName;
        medicine.genericName = genericName || medicine.genericName;
        medicine.strength = strength || medicine.strength;
        medicine.type = type || medicine.type;
        medicine.manufacturer = manufacturer || medicine.manufacturer;
        medicine.description = description || medicine.description;
        medicine.usage = usage || medicine.usage;
        medicine.sideEffects = sideEffects || medicine.sideEffects;
        medicine.precautions = precautions || medicine.precautions;
        medicine.category = category || medicine.category;
        medicine.price = price || medicine.price;
        medicine.image = image || medicine.image;

        const updatedMedicine = await medicine.save();
        res.json(updatedMedicine);
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Admin
const deleteMedicine = asyncHandler(async (req, res) => {
    const medicine = await Medicine.findById(req.params.id);

    if (medicine) {
        await medicine.deleteOne();
        res.json({ message: 'Medicine removed' });
    } else {
        res.status(404);
        throw new Error('Medicine not found');
    }
});

export {
    searchMedicines,
    getMedicineById,
    createMedicine,
    updateMedicine,
    deleteMedicine
};
