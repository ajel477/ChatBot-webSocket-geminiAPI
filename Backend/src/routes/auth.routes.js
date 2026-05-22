const express = require('express');

const authController = require('../controllers/authController');

const { authUser } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get(
    "/profile",
    authUser,
    authController.getProfile
);

router.post(
    "/logout",
    authUser,
    authController.logoutUser
);

module.exports = router;