const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.get('/update/:id', passport.checkAuthentication, usersController.getupdate);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/changepass', passport.checkAuthentication, usersController.changepass);
router.post('/change', passport.checkAuthentication, usersController.change);
router.get('/sign-up',usersController.admin, usersController.signUp);
router.get('/sign-in', usersController.signIn);


router.post('/create',usersController.admin, usersController.create);

// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'},
), usersController.createSession);


router.get('/sign-out', usersController.destroySession);

module.exports = router;