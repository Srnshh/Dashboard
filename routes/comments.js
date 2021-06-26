const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');


router.post('/submit', passport.checkAuthentication, commentsController.submit);

router.get('/delete/:id', passport.checkAuthentication, commentsController.delete);



module.exports = router;