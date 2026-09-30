const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { success: successResponse } = require('../utils/response');

const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

// POST /api/contact - Submit a contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(res, 'All fields are required', 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 'Please provide a valid email address', 400);
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    return successResponse(res, contactMessage, 'Message sent successfully');
  } catch (error) {
    console.error('Submit contact message error:', error);
    return errorResponse(res, 'Failed to send message', 500);
  }
});

module.exports = router;
