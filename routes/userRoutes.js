
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin, isAuthorized } = require('../middlewares/auth');

router.get('/', isAdmin, userController.getAllUsers);
router.get('/:id', isAuthorized, userController.getUser);
router.put('/:id', isAuthorized, userController.updateUser);

module.exports = router;