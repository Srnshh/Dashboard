const express = require('express');
const passport = require('passport');

const router = express.Router();
const homeController = require('../controllers/home_controller');
const dailylogController = require('../controllers/dailylog_controller');
const groupController = require('../controllers/groups_controller'); 

console.log('router loaded');


router.get('/', homeController.home);
router.get('/heirarchy', homeController.heirarchy);
router.get('/notification', homeController.notinotification);
router.get('/notification/alldelete', homeController.alldeletenoty);
router.get('/notification/delete/:id', homeController.deletenoty);
router.get('/chatnotification', homeController.chatnotification);
router.get('/chatnotification/alldelete', homeController.alldeletechatnoty);
router.get('/chatnotification/delete/:id', homeController.deletechatnoty);
router.get('/dailylog', dailylogController.dailylog);
router.post('/dailylog/submit', dailylogController.dsubmit);
router.get('/dailylog/get', dailylogController.checklog);
router.get('/dailylog/delete/:id', dailylogController.delete);
router.get('/hisdailylog/:id2',passport.checkAuthentication,groupController.checkuser, dailylogController.hisdailylog);
router.get('/hisdailylog/:id2/get',passport.checkAuthentication,groupController.checkuser, dailylogController.hischecklog);

router.use('/chat', require('./chat'));
router.use('/group',require('./group'));
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/taskcomment', require('./comments'));
router.use('/assigntask', require('./posts'));
router.get('/giventask', passport.checkAuthentication, homeController.giventask);
router.get('/ongoingtask', passport.checkAuthentication, homeController.ongoingtask);
router.get('/completedtask', passport.checkAuthentication, homeController.completedtask);

router.get('/friends',passport.checkAuthentication, homeController.friends);
router.get('/giventask/delete/:id', passport.checkAuthentication, homeController.delete);
router.get('/giventask/complete/:id', passport.checkAuthentication, homeController.complete);
router.get('/task/:id',passport.checkAuthentication, homeController.task);


// for any further routes, access from here
// router.use('/routerName', require('./routerfile));


module.exports = router;