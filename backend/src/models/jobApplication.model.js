import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    // Career reference
    careerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    
    // Applicant information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    
    // Application content
    coverLetter: {
        type: String,
        required: true
    },
    experience: {
        type: String
    },
    
    // Additional information
    expectedSalary: {
        type: String
    },
    availableStartDate: {
        type: Date
    },
    linkedinProfile: {
        type: String
    },
    portfolio: {
        type: String
    },
    
    // File uploads
    resumeUrl: {
        type: String,
        required: true
    },
    portfolioUrl: {
        type: String
    },
    
    // Application status
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    
    // Admin notes
    adminNotes: {
        type: String
    },
    
    // User reference (if logged in)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for efficient queries
jobApplicationSchema.index({ careerId: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1 });
jobApplicationSchema.index({ status: 1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;
