const express = require('express');
const router = express.Router();

// import middlewares
const { requireSignin, authMiddleware, adminMiddleware } = require('../../controllers/auth/auth');

// import controllers
const { read } = require('../../controllers/auth/user');

// routes
// router.get('/user', authMiddleware, read);
router.get('/user', requireSignin, authMiddleware, read);
// router.get('/admin', adminMiddleware, read);
router.get('/admin', requireSignin, adminMiddleware, read);


module.exports = router;
