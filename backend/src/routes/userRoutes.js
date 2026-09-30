const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const { admin } = require('../middlewares/admin');

// All user management routes require admin access
router.use(auth, admin);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id/role', userController.updateUserRole);
router.put('/:id/status', userController.toggleUserStatus);

module.exports = router;
