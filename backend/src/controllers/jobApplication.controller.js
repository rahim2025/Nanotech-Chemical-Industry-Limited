import JobApplication from "../models/jobApplication.model.js";
import Career from "../models/career.model.js";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const submitApplication = async (req, res) => {
    try {
        const {
            careerId,
            jobTitle,
            fullName,
            email,
            phone,
            coverLetter,
            experience,
            expectedSalary,
            availableStartDate,
            linkedinProfile,
            portfolio
        } = req.body;

        // Validate required fields
        if (!careerId || !jobTitle || !fullName || !email || !phone || !coverLetter) {
            return res.status(400).json({
                message: "Missing required fields"
            });
        }

        // Check if career exists and is active
        const career = await Career.findById(careerId);
        if (!career || !career.isActive) {
            return res.status(404).json({
                message: "Career post not found or no longer active"
            });
        }

        // Check if application deadline has passed
        if (career.applicationDeadline && new Date(career.applicationDeadline) < new Date()) {
            return res.status(400).json({
                message: "Application deadline has passed"
            });
        }

        // Check if files were uploaded
        if (!req.files || !req.files.resume) {
            return res.status(400).json({
                message: "Resume is required"
            });
        }

        // Check for duplicate application (same email for same career)
        const existingApplication = await JobApplication.findOne({
            careerId: careerId,
            email: email.toLowerCase()
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this position"
            });
        }

        // Generate file URLs
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const resumeUrl = `${baseUrl}/uploads/applications/${req.files.resume[0].filename}`;
        let portfolioUrl = null;

        if (req.files.portfolio && req.files.portfolio[0]) {
            portfolioUrl = `${baseUrl}/uploads/applications/${req.files.portfolio[0].filename}`;
        }

        // Create job application
        const applicationData = {
            careerId,
            jobTitle,
            fullName: fullName.trim(),
            email: email.toLowerCase().trim(),
            phone: phone.trim(),
            coverLetter,
            experience,
            expectedSalary,
            availableStartDate: availableStartDate ? new Date(availableStartDate) : null,
            linkedinProfile,
            portfolio,
            resumeUrl,
            portfolioUrl,
            userId: req.user?._id || null
        };

        const application = new JobApplication(applicationData);
        await application.save();

        // Populate career details for response
        await application.populate('careerId', 'title department location');

        res.status(201).json({
            message: "Application submitted successfully",
            application: {
                _id: application._id,
                jobTitle: application.jobTitle,
                fullName: application.fullName,
                email: application.email,
                status: application.status,
                submittedAt: application.createdAt,
                career: application.careerId
            }
        });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getApplications = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, careerId } = req.query;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (careerId) {
            filter.careerId = careerId;
        }

        const applications = await JobApplication.find(filter)
            .populate('careerId', 'title department location')
            .populate('userId', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await JobApplication.countDocuments(filter);

        res.json({
            applications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalApplications: total,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await JobApplication.findById(id)
            .populate('careerId', 'title description department location jobType experienceLevel')
            .populate('userId', 'fullName email');

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({ application });

    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        const validStatuses = ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const application = await JobApplication.findByIdAndUpdate(
            id,
            { 
                status,
                adminNotes: adminNotes || undefined
            },
            { new: true }
        ).populate('careerId', 'title department location');

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await JobApplication.findByIdAndDelete(id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        // Here you could also delete the uploaded files if needed
        // fs.unlinkSync(path.join(__dirname, '../../uploads/applications/', filename));

        res.json({
            message: "Application deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting application:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getMyApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const applications = await JobApplication.find({ userId })
            .populate('careerId', 'title department location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await JobApplication.countDocuments({ userId });

        res.json({
            applications,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalApplications: total
            }
        });

    } catch (error) {
        console.error("Error fetching user applications:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
