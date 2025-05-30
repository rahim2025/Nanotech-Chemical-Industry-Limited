import Contact from "../models/contact.model.js";
import { createNotification } from "./notification.controller.js";

// Create a new contact message
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide all required fields (name, email, subject, message)" 
      });
    }
    
    // Create new contact message in database
    const newContactMessage = new Contact({
      name,
      email,
      phone: phone || "",
      subject,
      message
    });
    
    await newContactMessage.save();
    
    // Create notification for admin users
    try {
      await createNotification({
        type: "contact",
        title: "New Contact Message",
        message: `New contact message received from ${name} - Subject: ${subject}`,
        data: {
          contactId: newContactMessage._id,
          customerName: name,
          customerEmail: email,
          subject: subject,
          messagePreview: message.substring(0, 100) + (message.length > 100 ? '...' : '')
        },
        recipientRole: "admin",
        priority: "medium"
      });
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Don't fail the contact message creation if notification fails
    }
    
    res.status(201).json({ 
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon!", 
      data: {
        id: newContactMessage._id,
        name: newContactMessage.name,
        email: newContactMessage.email,
        subject: newContactMessage.subject,
        createdAt: newContactMessage.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error.message 
    });
  }
};

// Get all contact messages (admin only)
export const getAllContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalContacts = await Contact.countDocuments();
    const totalPages = Math.ceil(totalContacts / limit);
    
    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalContacts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch contact messages",
      error: error.message 
    });
  }
};

// Get single contact message by ID (admin only)
export const getContactMessageById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error("Error fetching contact message:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch contact message",
      error: error.message 
    });
  }
};

// Update contact message status (admin only)
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["new", "inProgress", "responded", "closed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: new, inProgress, responded, closed"
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        isResolved: status === "responded" || status === "closed"
      },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Contact message status updated successfully",
      data: contact
    });
  } catch (error) {
    console.error("Error updating contact message status:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update contact message status",
      error: error.message 
    });
  }
};

// Mark contact message as read (admin only)
export const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Contact message marked as read",
      data: contact
    });
  } catch (error) {
    console.error("Error marking contact as read:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to mark contact as read",
      error: error.message 
    });
  }
};

// Delete contact message (admin only)
export const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Contact message deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete contact message",
      error: error.message 
    });
  }
};
