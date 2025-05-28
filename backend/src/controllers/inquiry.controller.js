import Inquiry from "../models/inquiry.model.js";
import User from "../models/user.model.js";
import { createNotification } from "./notification.controller.js";

// Create a new inquiry
export const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, inquiry, productId, productName, inquiryType } = req.body;
    
    // Validate required fields
    if (!name || !email || !inquiry || !productId || !productName) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }
    
    // Create new inquiry in database
    const newInquiry = new Inquiry({
      name,
      email,
      phone: phone || "",
      inquiry,
      productId,
      productName,
      inquiryType: inquiryType || "pricing"
    });
      await newInquiry.save();
    
    // Create notification for admin users
    try {
      await createNotification({
        type: "inquiry",
        title: "New Product Inquiry",
        message: `New inquiry received for "${productName}" from ${name}`,
        data: {
          inquiryId: newInquiry._id,
          productId,
          productName,
          customerName: name,
          customerEmail: email,
          inquiryType: inquiryType || "pricing"
        },
        recipientRole: "admin",
        priority: "medium"
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the inquiry creation if notification fails
    }
    
    res.status(201).json({ 
      message: "Your inquiry has been submitted successfully", 
      inquiry: newInquiry 
    });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Failed to submit inquiry" });
  }
};

// Get all inquiries (admin only)
export const getAllInquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit)
    };
    
    const inquiries = await Inquiry.find(query, null, options);
    const totalInquiries = await Inquiry.countDocuments(query);
    
    res.status(200).json({
      inquiries,
      pagination: {
        totalInquiries,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalInquiries / limit),
        hasMore: page < Math.ceil(totalInquiries / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
};

// Get a specific inquiry by ID
export const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    res.status(200).json(inquiry);
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    res.status(500).json({ message: "Failed to fetch inquiry" });
  }
};

// Update inquiry status (admin only)
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status, isResolved } = req.body;
    
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status, isResolved },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    res.status(200).json({ 
      message: "Inquiry status updated successfully",
      inquiry
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    res.status(500).json({ message: "Failed to update inquiry status" });
  }
};
