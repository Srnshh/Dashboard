const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');


router.post('/submit', passport.checkAuthentication, postsController.submit);




module.exports = router;