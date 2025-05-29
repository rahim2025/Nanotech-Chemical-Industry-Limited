import Career from "../models/career.model.js";

// Get all careers (public)
export const getCareers = async (req, res) => {
    try {
        const careers = await Career.find({ isActive: true })
            .populate('postedBy', 'username email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: careers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch careers",
            error: error.message
        });
    }
};

// Get all careers for admin (including inactive)
export const getAllCareersAdmin = async (req, res) => {
    try {
        const careers = await Career.find()
            .populate('postedBy', 'username email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: careers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch careers",
            error: error.message
        });
    }
};

// Get single career by ID
export const getCareerById = async (req, res) => {
    try {
        const career = await Career.findById(req.params.id)
            .populate('postedBy', 'username email');
        
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career post not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: career
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch career details",
            error: error.message
        });
    }
};

// Create new career post (admin only)
export const createCareer = async (req, res, next) => {
    try {
        const careerData = {
            ...req.body,
            postedBy: req.user.id
        };
        
        const career = new Career(careerData);
        const savedCareer = await career.save();
        
        const populatedCareer = await Career.findById(savedCareer._id)
            .populate('postedBy', 'username email');
        
        res.status(201).json({
            success: true,
            message: 'Career post created successfully',
            data: populatedCareer
        });
    } catch (error) {
        next(error);
    }
};

// Update career post (admin only)
export const updateCareer = async (req, res, next) => {
    try {
        const career = await Career.findById(req.params.id);
        
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career post not found'
            });
        }
        
        const updatedCareer = await Career.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('postedBy', 'username email');
        
        res.status(200).json({
            success: true,
            message: 'Career post updated successfully',
            data: updatedCareer
        });
    } catch (error) {
        next(error);
    }
};

// Delete career post (admin only)
export const deleteCareer = async (req, res, next) => {
    try {
        const career = await Career.findById(req.params.id);
        
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career post not found'
            });
        }
        
        await Career.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Career post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Toggle career status (active/inactive) - admin only
export const toggleCareerStatus = async (req, res, next) => {
    try {
        const career = await Career.findById(req.params.id);
        
        if (!career) {
            return res.status(404).json({
                success: false,
                message: 'Career post not found'
            });
        }
        
        career.isActive = !career.isActive;
        await career.save();
        
        const updatedCareer = await Career.findById(career._id)
            .populate('postedBy', 'username email');
        
        res.status(200).json({
            success: true,
            message: `Career post ${career.isActive ? 'activated' : 'deactivated'} successfully`,
            data: updatedCareer
        });
    } catch (error) {
        next(error);
    }
};
